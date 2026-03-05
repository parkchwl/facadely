import { NextResponse } from "next/server";
import {
  readSiteCustomization,
  setTypographyPresetEnabled,
  updateTypographyTokens,
  updateThemeTokens,
  upsertCustomFont,
  upsertElementPatch,
} from "@/lib/site-customization-store";
import { ThemeTokens, TypographyTokens } from "@/lib/site-customization-types";
import { readTemplateManifest } from "@/lib/template-manifest-store";
import {
  getDefaultCanonicalTemplatePath,
  toLegacyTemplatePath,
} from "@/lib/template-registry";
import {
  getAllowedStyleProperties,
  hasEditableField,
  isThemeTokenKey,
  TemplateEditableNode,
  EditableStyleProperty,
  TemplateManifest,
} from "@/lib/template-manifest-types";

type SaveCodeRequest = {
  sitePath?: string;
  editId?: string;
  patch?: {
    styles?: Record<string, string>;
    innerText?: string;
    src?: string;
    href?: string;
  };
  themeTokens?: Partial<ThemeTokens>;
  typographyTokens?: Partial<TypographyTokens>;
  typographyPresetEnabled?: boolean;
  customFont?: {
    family?: string;
    url?: string;
  };
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function sanitizeStyles(input: unknown): Record<string, string> {
  if (!isObject(input)) return {};
  return Object.fromEntries(
    Object.entries(input).filter(
      (entry): entry is [string, string] =>
        typeof entry[0] === "string" && typeof entry[1] === "string"
    )
  );
}

function sanitizeThemeTokens(
  input: unknown,
  manifest: TemplateManifest
): { value: Partial<ThemeTokens>; invalidKeys: string[] } {
  if (!isObject(input)) return { value: {}, invalidKeys: [] };

  const invalidKeys: string[] = [];
  const value: Partial<ThemeTokens> = {};

  for (const [key, rawValue] of Object.entries(input)) {
    if (!isThemeTokenKey(key) || typeof rawValue !== "string") {
      invalidKeys.push(key);
      continue;
    }
    if (!manifest.themeTokens.includes(key)) {
      invalidKeys.push(key);
      continue;
    }
    value[key] = rawValue;
  }

  return { value, invalidKeys };
}

const TYPOGRAPHY_PRESET_KEYS = ["heading", "body", "button"] as const;
const TYPOGRAPHY_FIELD_KEYS = [
  "fontFamily",
  "fontWeight",
  "fontSize",
  "lineHeight",
  "letterSpacing",
] as const;

function sanitizeTypographyTokens(input: unknown): {
  value: Partial<TypographyTokens>;
  invalidKeys: string[];
} {
  if (!isObject(input)) return { value: {}, invalidKeys: [] };

  const invalidKeys: string[] = [];
  const value: Partial<TypographyTokens> = {};

  for (const [presetKey, presetValue] of Object.entries(input)) {
    if (!TYPOGRAPHY_PRESET_KEYS.includes(presetKey as (typeof TYPOGRAPHY_PRESET_KEYS)[number])) {
      invalidKeys.push(presetKey);
      continue;
    }
    if (!isObject(presetValue)) {
      invalidKeys.push(presetKey);
      continue;
    }

    const nextPreset: Partial<TypographyTokens["heading"]> = {};
    for (const [fieldKey, fieldValue] of Object.entries(presetValue)) {
      if (
        !TYPOGRAPHY_FIELD_KEYS.includes(fieldKey as (typeof TYPOGRAPHY_FIELD_KEYS)[number]) ||
        typeof fieldValue !== "string"
      ) {
        invalidKeys.push(`${presetKey}.${fieldKey}`);
        continue;
      }
      nextPreset[fieldKey as (typeof TYPOGRAPHY_FIELD_KEYS)[number]] = fieldValue;
    }

    value[presetKey as (typeof TYPOGRAPHY_PRESET_KEYS)[number]] = nextPreset as TypographyTokens["heading"];
  }

  return { value, invalidKeys };
}

function validateElementPatch(
  editableNode: TemplateEditableNode,
  patch: SaveCodeRequest["patch"]
): { styles: Record<string, string>; innerText?: string; src?: string; href?: string } {
  const styles = sanitizeStyles(patch?.styles);
  const allowedStyleProperties = new Set<EditableStyleProperty>(
    getAllowedStyleProperties(editableNode.fields)
  );

  const invalidStyleKeys = Object.keys(styles).filter(
    (property) => !allowedStyleProperties.has(property as EditableStyleProperty)
  );
  if (invalidStyleKeys.length > 0) {
    throw new Error(
      `Unsupported style keys for ${editableNode.editId}: ${invalidStyleKeys.join(", ")}`
    );
  }

  const nextPatch: { styles: Record<string, string>; innerText?: string; src?: string; href?: string } = {
    styles,
  };

  if (typeof patch?.innerText === "string") {
    if (!hasEditableField(editableNode, "text")) {
      throw new Error(`Edit target ${editableNode.editId} does not allow text updates`);
    }
    nextPatch.innerText = patch.innerText;
  }

  if (typeof patch?.src === "string") {
    if (!hasEditableField(editableNode, "image")) {
      throw new Error(`Edit target ${editableNode.editId} does not allow image updates`);
    }
    nextPatch.src = patch.src;
  }

  if (typeof patch?.href === "string") {
    if (!hasEditableField(editableNode, "button")) {
      throw new Error(`Edit target ${editableNode.editId} does not allow link updates`);
    }
    nextPatch.href = patch.href;
  }

  return nextPatch;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const incomingSitePath = searchParams.get("sitePath") ?? getDefaultCanonicalTemplatePath();
    const sitePath = toLegacyTemplatePath(incomingSitePath);
    const customization = await readSiteCustomization(sitePath);
    return NextResponse.json({ success: true, customization });
  } catch (error) {
    console.error("save-code GET error:", error);
    return NextResponse.json({ error: "Failed to load site customization" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SaveCodeRequest;
    const incomingSitePath = body.sitePath ?? getDefaultCanonicalTemplatePath();
    const sitePath = toLegacyTemplatePath(incomingSitePath);
    const requiresWritePayload =
      (body.themeTokens && isObject(body.themeTokens)) ||
      (body.typographyTokens && isObject(body.typographyTokens)) ||
      typeof body.typographyPresetEnabled === "boolean" ||
      (body.customFont && isObject(body.customFont)) ||
      (typeof body.editId === "string" && isObject(body.patch));

    if (!requiresWritePayload) {
      return NextResponse.json(
        { error: "Missing payload. Provide themeTokens, typographyTokens, customFont, or editId+patch." },
        { status: 400 }
      );
    }

    const manifest = await readTemplateManifest(sitePath);
    if (!manifest) {
      return NextResponse.json(
        { error: `Template manifest not found for ${sitePath}.` },
        { status: 404 }
      );
    }

    let updatedCustomization = await readSiteCustomization(sitePath);

    if (body.themeTokens && isObject(body.themeTokens)) {
      const { value: tokens, invalidKeys } = sanitizeThemeTokens(body.themeTokens, manifest);
      if (invalidKeys.length > 0) {
        return NextResponse.json(
          { error: `Unsupported theme token keys: ${invalidKeys.join(", ")}` },
          { status: 400 }
        );
      }
      if (Object.keys(tokens).length > 0) {
        updatedCustomization = await updateThemeTokens(sitePath, tokens);
      }
    }

    if (body.typographyTokens && isObject(body.typographyTokens)) {
      const { value: tokens, invalidKeys } = sanitizeTypographyTokens(body.typographyTokens);
      if (invalidKeys.length > 0) {
        return NextResponse.json(
          { error: `Unsupported typography token keys: ${invalidKeys.join(", ")}` },
          { status: 400 }
        );
      }
      if (Object.keys(tokens).length > 0) {
        updatedCustomization = await updateTypographyTokens(sitePath, tokens);
      }
    }

    if (typeof body.typographyPresetEnabled === "boolean") {
      updatedCustomization = await setTypographyPresetEnabled(sitePath, body.typographyPresetEnabled);
    }

    if (body.customFont && isObject(body.customFont)) {
      const family = typeof body.customFont.family === "string" ? body.customFont.family.trim() : "";
      const url = typeof body.customFont.url === "string" ? body.customFont.url.trim() : "";
      if (!family || !url) {
        return NextResponse.json(
          { error: "customFont requires family and url." },
          { status: 400 }
        );
      }
      updatedCustomization = await upsertCustomFont(sitePath, { family, url });
    }

    const hasPatch = typeof body.editId === "string" && isObject(body.patch);
    if (hasPatch) {
      const editId = body.editId!.trim();
      const editableNode = manifest.editable.find((node) => node.editId === editId);
      if (!editableNode) {
        return NextResponse.json(
          { error: `editId "${editId}" is not declared in template manifest.` },
          { status: 400 }
        );
      }

      const validatedPatch = validateElementPatch(editableNode, body.patch);
      updatedCustomization = await upsertElementPatch(sitePath, {
        editId,
        styles: validatedPatch.styles,
        innerText: validatedPatch.innerText,
        src: validatedPatch.src,
        href: validatedPatch.href,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Saved customization data",
      customization: updatedCustomization,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("does not allow")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes("Unsupported style keys")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("save-code POST error:", error);
    return NextResponse.json({ error: "Failed to save site customization" }, { status: 500 });
  }
}
