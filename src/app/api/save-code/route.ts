import { NextResponse } from "next/server";
import {
  buildDefaultSiteCustomization,
  ThemeTokens,
  TypographyTokens,
} from "@/lib/site-customization-types";
import { readTemplateManifest } from "@/lib/template-manifest-store";
import { getDefaultCanonicalTemplatePath } from "@/lib/template-registry";
import {
  getAllowedStyleProperties,
  hasEditableField,
  isThemeTokenKey,
  TemplateEditableNode,
  EditableStyleProperty,
  TemplateManifest,
} from "@/lib/template-manifest-types";
import {
  requireAuthenticatedUser,
  requireSameOrigin,
} from "@/lib/server/api-security";
import {
  BackendSiteApiError,
  getOwnedSiteCustomizationFromBackend,
  getPublishedSiteCustomizationFromBackend,
  saveSiteCustomizationToBackend,
} from "@/lib/server/site-backend";
import { isCanonicalTemplatePath, resolveTemplateSourcePath } from "@/lib/user-site-store";

type SaveCodeRequest = {
  siteId?: string;
  sitePath?: string;
  templatePath?: string;
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
  patches?: Array<{
    editId?: string;
    patch?: {
      styles?: Record<string, string>;
      innerText?: string;
      src?: string;
      href?: string;
    };
  }>;
};

const SAFE_FONT_FAMILY = /^[a-z0-9 _-]{2,64}$/i;
const SAFE_FONT_URL = /^\/(?:uploads\/fonts|fonts)\/[a-z0-9/_-]+\.woff2$/i;

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

function isSafeRelativePath(value: string): boolean {
  return value.startsWith("/") && !value.startsWith("//") && !value.includes("..");
}

function isSafeHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function sanitizeHref(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("href is invalid");
  if (trimmed.startsWith("#")) return trimmed;
  if (isSafeRelativePath(trimmed)) return trimmed;

  try {
    const parsed = new URL(trimmed);
    if (["https:", "http:", "mailto:", "tel:"].includes(parsed.protocol)) {
      return trimmed;
    }
  } catch {
    throw new Error("href is invalid");
  }

  throw new Error("href is invalid");
}

function sanitizeImageSrc(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("src is invalid");
  if (isSafeRelativePath(trimmed) || isSafeHttpUrl(trimmed)) return trimmed;
  throw new Error("src is invalid");
}

function sanitizeCustomFont(input: { family: string; url: string }): { family: string; url: string } {
  const family = input.family.trim().replace(/\s+/g, " ");
  const url = input.url.trim();

  if (!SAFE_FONT_FAMILY.test(family) || !SAFE_FONT_URL.test(url)) {
    throw new Error("customFont is invalid");
  }

  return { family, url };
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
    nextPatch.src = sanitizeImageSrc(patch.src);
  }

  if (typeof patch?.href === "string") {
    if (!hasEditableField(editableNode, "button")) {
      throw new Error(`Edit target ${editableNode.editId} does not allow link updates`);
    }
    nextPatch.href = sanitizeHref(patch.href);
  }

  return nextPatch;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const incomingSitePath = searchParams.get("sitePath")?.trim() ?? "";
    const siteId = searchParams.get("siteId") ?? "";
    const publishedSlug = searchParams.get("publishedSlug") ?? "";

    if (publishedSlug) {
      const customization = await getPublishedSiteCustomizationFromBackend(publishedSlug);
      return NextResponse.json({ success: true, customization });
    }

    if (!siteId && !incomingSitePath) {
      return NextResponse.json({
        success: true,
        customization: buildDefaultSiteCustomization(getDefaultCanonicalTemplatePath()),
      });
    }

    if (!siteId && isCanonicalTemplatePath(incomingSitePath)) {
      return NextResponse.json({
        success: true,
        customization: buildDefaultSiteCustomization(incomingSitePath),
      });
    }

    await requireAuthenticatedUser(req);
    const cookieHeader = req.headers.get("cookie") ?? "";
    const customization = await getOwnedSiteCustomizationFromBackend(cookieHeader, {
      siteId: siteId || undefined,
      sitePath: incomingSitePath,
    });
    return NextResponse.json({ success: true, customization });
  } catch (error) {
    if (error instanceof BackendSiteApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    console.error("save-code GET error:", error);
    return NextResponse.json({ error: "Failed to load site customization" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    requireSameOrigin(req);
    await requireAuthenticatedUser(req);
    const body = (await req.json()) as SaveCodeRequest;
    const incomingSitePath = typeof body.sitePath === "string" ? body.sitePath.trim() : "";
    const incomingSiteId = typeof body.siteId === "string" ? body.siteId.trim() : "";
    const requestedPatches = Array.isArray(body.patches) ? body.patches : [];
    const singlePatchRequested = typeof body.editId === "string" && isObject(body.patch);
    const hasPatchBatch = requestedPatches.length > 0;
    const requiresWritePayload =
      (body.themeTokens && isObject(body.themeTokens)) ||
      (body.typographyTokens && isObject(body.typographyTokens)) ||
      typeof body.typographyPresetEnabled === "boolean" ||
      (body.customFont && isObject(body.customFont)) ||
      singlePatchRequested ||
      hasPatchBatch;

    if (!requiresWritePayload) {
      return NextResponse.json(
        { error: "Missing payload. Provide themeTokens, typographyTokens, customFont, or editId+patch." },
        { status: 400 }
      );
    }

    if (!incomingSiteId && !incomingSitePath) {
      return NextResponse.json(
        { error: "siteId or sitePath is required." },
        { status: 400 }
      );
    }

    if (!incomingSiteId && isCanonicalTemplatePath(incomingSitePath)) {
      return NextResponse.json(
        { error: "Create a site from this template before saving customizations." },
        { status: 400 }
      );
    }

    const templateSourcePath =
      typeof body.templatePath === "string" && body.templatePath.trim()
        ? body.templatePath.trim()
        : incomingSitePath
          ? resolveTemplateSourcePath(incomingSitePath)
          : "";
    if (!templateSourcePath) {
      return NextResponse.json(
        { error: "templatePath is required when sitePath is omitted." },
        { status: 400 }
      );
    }
    const manifest = await readTemplateManifest(templateSourcePath);
    if (!manifest) {
      return NextResponse.json(
        { error: `Template manifest not found for ${incomingSitePath}.` },
        { status: 404 }
      );
    }

    if (body.themeTokens && isObject(body.themeTokens)) {
      const { value: tokens, invalidKeys } = sanitizeThemeTokens(body.themeTokens, manifest);
      if (invalidKeys.length > 0) {
        return NextResponse.json(
          { error: `Unsupported theme token keys: ${invalidKeys.join(", ")}` },
          { status: 400 }
        );
      }
      body.themeTokens = tokens;
    }

    if (body.typographyTokens && isObject(body.typographyTokens)) {
      const { value: tokens, invalidKeys } = sanitizeTypographyTokens(body.typographyTokens);
      if (invalidKeys.length > 0) {
        return NextResponse.json(
          { error: `Unsupported typography token keys: ${invalidKeys.join(", ")}` },
          { status: 400 }
        );
      }
      body.typographyTokens = tokens;
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
      body.customFont = sanitizeCustomFont({ family, url });
    }

    const patchRequests = [
      ...(singlePatchRequested ? [{ editId: body.editId, patch: body.patch }] : []),
      ...requestedPatches,
    ];

    for (const patchRequest of patchRequests) {
      const editId = typeof patchRequest.editId === "string" ? patchRequest.editId.trim() : "";
      if (!editId || !isObject(patchRequest.patch)) {
        return NextResponse.json(
          { error: "Each patch request requires editId and patch." },
          { status: 400 }
        );
      }

      const editableNode = manifest.editable.find((node) => node.editId === editId);
      if (!editableNode) {
        return NextResponse.json(
          { error: `editId "${editId}" is not declared in template manifest.` },
          { status: 400 }
        );
      }

      const validatedPatch = validateElementPatch(editableNode, patchRequest.patch);
      patchRequest.patch = {
        styles: validatedPatch.styles,
        innerText: validatedPatch.innerText,
        src: validatedPatch.src,
        href: validatedPatch.href,
      };
    }

    const cookieHeader = req.headers.get("cookie") ?? "";
    const normalizedBody: Record<string, unknown> = {
      ...body,
      siteId: incomingSiteId || undefined,
      sitePath: incomingSitePath || undefined,
    };
    delete normalizedBody.templatePath;

    if (patchRequests.length > 0) {
      normalizedBody.patches = patchRequests.map((patchRequest) => ({
        editId: patchRequest.editId,
        patch: patchRequest.patch,
      }));
      delete normalizedBody.editId;
      delete normalizedBody.patch;
    }

    const updatedCustomization = await saveSiteCustomizationToBackend(cookieHeader, normalizedBody);

    return NextResponse.json({
      success: true,
      message: "Saved customization data",
      customization: updatedCustomization,
    });
  } catch (error) {
    if (error instanceof BackendSiteApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof Error && (error.message === "FORBIDDEN_ORIGIN" || error.message === "MISSING_ORIGIN")) {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (error instanceof Error && error.message.includes("does not allow")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes("Unsupported style keys")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof Error && /is invalid/.test(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("save-code POST error:", error);
    return NextResponse.json({ error: "Failed to save site customization" }, { status: 500 });
  }
}
