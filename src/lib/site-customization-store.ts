import fs from "fs/promises";
import path from "path";
import {
  cloneDefaultTypographyTokens,
  CustomFontAsset,
  DEFAULT_TYPOGRAPHY_TOKENS,
  DEFAULT_THEME_TOKENS,
  ElementPatch,
  SiteCustomization,
  ThemeTokens,
  TypographyPreset,
  TypographyTokens,
} from "@/lib/site-customization-types";
import {
  getDefaultLegacyTemplatePath,
  toLegacyTemplatePath,
} from "@/lib/template-registry";

const RUNTIME_DATA_DIR = path.join(process.cwd(), ".runtime", "sites");
const LEGACY_DATA_DIR = path.join(process.cwd(), "data", "sites");
const SAFE_SITE_PATH = /^\/[a-z0-9/-]*$/;
const SAFE_EDIT_ID = /^[a-z0-9][a-z0-9_-]*$/i;
const SAFE_FONT_FAMILY = /^[a-z0-9 _-]{2,64}$/i;
const SAFE_FONT_URL = /^\/(?:uploads\/fonts|fonts)\/[a-z0-9/_-]+\.woff2$/i;

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

function sanitizeStoredHref(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("#")) return trimmed;
  if (isSafeRelativePath(trimmed)) return trimmed;

  try {
    const parsed = new URL(trimmed);
    if (["https:", "http:", "mailto:", "tel:"].includes(parsed.protocol)) {
      return trimmed;
    }
  } catch {
    return null;
  }

  return null;
}

function sanitizeStoredImageSrc(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (isSafeRelativePath(trimmed) || isSafeHttpUrl(trimmed)) return trimmed;
  return null;
}

function sanitizeStoredFont(input: { family: string; url: string }): { family: string; url: string } | null {
  const family = input.family.trim().replace(/\s+/g, " ");
  const url = input.url.trim();

  if (!SAFE_FONT_FAMILY.test(family)) return null;
  if (!SAFE_FONT_URL.test(url)) return null;

  return { family, url };
}

function normalizeSitePath(sitePath: string): string {
  if (!sitePath) return getDefaultLegacyTemplatePath();
  const withLeadingSlash = sitePath.startsWith("/") ? sitePath : `/${sitePath}`;
  const normalized = withLeadingSlash.replace(/\/+/g, "/");
  const normalizedWithoutTrailingSlash =
    normalized.length > 1 && normalized.endsWith("/")
      ? normalized.slice(0, -1)
      : normalized;
  return toLegacyTemplatePath(normalizedWithoutTrailingSlash);
}

function assertSafeSitePath(sitePath: string): string {
  const normalized = normalizeSitePath(sitePath);
  if (!SAFE_SITE_PATH.test(normalized) || normalized.includes("..")) {
    throw new Error("Invalid site path");
  }
  return normalized;
}

function sitePathToId(sitePath: string): string {
  if (sitePath === "/") return "root";
  return sitePath.slice(1).replace(/\//g, "__");
}

function runtimeSiteFilePath(sitePath: string): string {
  const safePath = assertSafeSitePath(sitePath);
  return path.join(RUNTIME_DATA_DIR, `${sitePathToId(safePath)}.json`);
}

function legacySiteFilePath(sitePath: string): string {
  const safePath = assertSafeSitePath(sitePath);
  return path.join(LEGACY_DATA_DIR, `${sitePathToId(safePath)}.json`);
}

async function ensureStoreDir(): Promise<void> {
  await fs.mkdir(RUNTIME_DATA_DIR, { recursive: true });
}

function buildDefaultSiteCustomization(sitePath: string): SiteCustomization {
  const normalized = assertSafeSitePath(sitePath);
  return {
    sitePath: normalized,
    themeTokens: { ...DEFAULT_THEME_TOKENS },
    typographyTokens: cloneDefaultTypographyTokens(),
    typographyPresetEnabled: false,
    customFonts: [],
    elements: [],
    updatedAt: new Date().toISOString(),
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function extractEditIdFromSelector(selector: string): string | null {
  const trimmed = selector.trim();
  const match = trimmed.match(/^\[data-edit-id=(?:"([^"]+)"|'([^']+)')\]$/);
  if (!match) return null;
  const extracted = (match[1] ?? match[2] ?? "").trim();
  return extracted || null;
}

function normalizeStyles(styles: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(styles)
      .map(([property, value]) => [property.trim(), value.trim()])
      .filter(([property, value]) => property.length > 0 && value.length > 0)
  );
}

function mergeTypographyPreset(
  base: TypographyPreset,
  input: Partial<TypographyPreset> | undefined
): TypographyPreset {
  return {
    fontFamily:
      typeof input?.fontFamily === "string" && input.fontFamily.trim()
        ? input.fontFamily.trim()
        : base.fontFamily,
    fontWeight:
      typeof input?.fontWeight === "string" && input.fontWeight.trim()
        ? input.fontWeight.trim()
        : base.fontWeight,
    fontSize:
      typeof input?.fontSize === "string" && input.fontSize.trim()
        ? input.fontSize.trim()
        : base.fontSize,
    lineHeight:
      typeof input?.lineHeight === "string" && input.lineHeight.trim()
        ? input.lineHeight.trim()
        : base.lineHeight,
    letterSpacing:
      typeof input?.letterSpacing === "string" && input.letterSpacing.trim()
        ? input.letterSpacing.trim()
        : base.letterSpacing,
  };
}

function normalizeTypographyTokens(input: unknown): TypographyTokens {
  if (!isObject(input)) {
    return cloneDefaultTypographyTokens();
  }

  const headingInput = isObject(input.heading)
    ? (input.heading as Partial<TypographyPreset>)
    : undefined;
  const bodyInput = isObject(input.body)
    ? (input.body as Partial<TypographyPreset>)
    : undefined;
  const buttonInput = isObject(input.button)
    ? (input.button as Partial<TypographyPreset>)
    : undefined;

  return {
    heading: mergeTypographyPreset(DEFAULT_TYPOGRAPHY_TOKENS.heading, headingInput),
    body: mergeTypographyPreset(DEFAULT_TYPOGRAPHY_TOKENS.body, bodyInput),
    button: mergeTypographyPreset(DEFAULT_TYPOGRAPHY_TOKENS.button, buttonInput),
  };
}

function normalizeStoredCustomFont(input: unknown): CustomFontAsset | null {
  if (!isObject(input)) return null;
  const family = typeof input.family === "string" ? input.family.trim() : "";
  const url = typeof input.url === "string" ? input.url.trim() : "";
  const safeFont = sanitizeStoredFont({ family, url });
  if (!safeFont) return null;
  return {
    family: safeFont.family,
    url: safeFont.url,
    uploadedAt: typeof input.uploadedAt === "string" ? input.uploadedAt : new Date().toISOString(),
  };
}

function normalizeStoredElementPatch(value: unknown): ElementPatch | null {
  if (!isObject(value)) return null;

  const directEditId = typeof value.editId === "string" ? value.editId.trim() : "";
  const legacySelector = typeof value.selector === "string" ? value.selector : "";
  const fallbackEditId = legacySelector ? extractEditIdFromSelector(legacySelector) : null;
  const editId = directEditId || fallbackEditId || "";

  if (!SAFE_EDIT_ID.test(editId)) return null;

  const rawStyles = isObject(value.styles)
    ? Object.fromEntries(
      Object.entries(value.styles).filter(
        (entry): entry is [string, string] =>
          typeof entry[0] === "string" && typeof entry[1] === "string"
      )
    )
    : {};

  const patch: ElementPatch = {
    editId,
    styles: normalizeStyles(rawStyles),
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : new Date().toISOString(),
  };

  if (typeof value.innerText === "string") patch.innerText = value.innerText;
  if (typeof value.src === "string") {
    const safeSrc = sanitizeStoredImageSrc(value.src);
    if (safeSrc) patch.src = safeSrc;
  }
  if (typeof value.href === "string") {
    const safeHref = sanitizeStoredHref(value.href);
    if (safeHref) patch.href = safeHref;
  }

  return patch;
}

export async function readSiteCustomization(sitePath: string): Promise<SiteCustomization> {
  await ensureStoreDir();
  const fileCandidates = [runtimeSiteFilePath(sitePath), legacySiteFilePath(sitePath)];

  for (const filePath of fileCandidates) {
    try {
      const raw = await fs.readFile(filePath, "utf8");
      const parsed = JSON.parse(raw) as Partial<SiteCustomization>;

      return {
        sitePath: assertSafeSitePath(parsed.sitePath ?? sitePath),
        themeTokens: {
          ...DEFAULT_THEME_TOKENS,
          ...(parsed.themeTokens ?? {}),
        },
        typographyTokens: normalizeTypographyTokens(parsed.typographyTokens),
        typographyPresetEnabled: parsed.typographyPresetEnabled === true,
        customFonts: Array.isArray(parsed.customFonts)
          ? parsed.customFonts
            .map((value) => normalizeStoredCustomFont(value))
            .filter((value): value is CustomFontAsset => value !== null)
          : [],
        elements: Array.isArray(parsed.elements)
          ? parsed.elements
            .map((value) => normalizeStoredElementPatch(value))
            .filter((value): value is ElementPatch => value !== null)
          : [],
        updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
      };
    } catch {
      continue;
    }
  }

  return buildDefaultSiteCustomization(sitePath);
}

export async function writeSiteCustomization(customization: SiteCustomization): Promise<void> {
  await ensureStoreDir();
  const filePath = runtimeSiteFilePath(customization.sitePath);
  const payload: SiteCustomization = {
    ...customization,
    sitePath: assertSafeSitePath(customization.sitePath),
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

type ElementPatchInput = {
  editId: string;
  styles: Record<string, string>;
  innerText?: string;
  src?: string;
  href?: string;
};

export async function upsertElementPatch(sitePath: string, patch: ElementPatchInput): Promise<SiteCustomization> {
  const customization = await readSiteCustomization(sitePath);
  const editId = patch.editId.trim();
  if (!SAFE_EDIT_ID.test(editId)) throw new Error("editId is invalid");

  const nextPatch: ElementPatch = {
    editId,
    styles: normalizeStyles(patch.styles),
    updatedAt: new Date().toISOString(),
  };
  if (typeof patch.innerText === "string") nextPatch.innerText = patch.innerText;
  if (typeof patch.src === "string") {
    const safeSrc = sanitizeStoredImageSrc(patch.src);
    if (!safeSrc) throw new Error("src is invalid");
    nextPatch.src = safeSrc;
  }
  if (typeof patch.href === "string") {
    const safeHref = sanitizeStoredHref(patch.href);
    if (!safeHref) throw new Error("href is invalid");
    nextPatch.href = safeHref;
  }

  const existingIndex = customization.elements.findIndex((item) => item.editId === editId);
  if (existingIndex >= 0) {
    const existing = customization.elements[existingIndex];
    customization.elements[existingIndex] = {
      ...existing,
      ...nextPatch,
      styles: {
        ...existing.styles,
        ...nextPatch.styles,
      },
    };
  } else {
    customization.elements.push(nextPatch);
  }

  customization.updatedAt = new Date().toISOString();
  await writeSiteCustomization(customization);
  return customization;
}

export async function updateThemeTokens(sitePath: string, tokens: Partial<ThemeTokens>): Promise<SiteCustomization> {
  const customization = await readSiteCustomization(sitePath);
  customization.themeTokens = {
    ...customization.themeTokens,
    ...tokens,
  };
  customization.updatedAt = new Date().toISOString();
  await writeSiteCustomization(customization);
  return customization;
}

export async function updateTypographyTokens(
  sitePath: string,
  tokens: Partial<TypographyTokens>
): Promise<SiteCustomization> {
  const customization = await readSiteCustomization(sitePath);
  customization.typographyTokens = {
    heading: mergeTypographyPreset(
      customization.typographyTokens.heading,
      isObject(tokens.heading) ? (tokens.heading as Partial<TypographyPreset>) : undefined
    ),
    body: mergeTypographyPreset(
      customization.typographyTokens.body,
      isObject(tokens.body) ? (tokens.body as Partial<TypographyPreset>) : undefined
    ),
    button: mergeTypographyPreset(
      customization.typographyTokens.button,
      isObject(tokens.button) ? (tokens.button as Partial<TypographyPreset>) : undefined
    ),
  };
  customization.updatedAt = new Date().toISOString();
  await writeSiteCustomization(customization);
  return customization;
}

export async function setTypographyPresetEnabled(
  sitePath: string,
  enabled: boolean
): Promise<SiteCustomization> {
  const customization = await readSiteCustomization(sitePath);
  customization.typographyPresetEnabled = enabled;
  customization.updatedAt = new Date().toISOString();
  await writeSiteCustomization(customization);
  return customization;
}

export async function upsertCustomFont(
  sitePath: string,
  font: { family: string; url: string }
): Promise<SiteCustomization> {
  const customization = await readSiteCustomization(sitePath);
  const safeFont = sanitizeStoredFont(font);
  if (!safeFont) throw new Error("custom font family or url is invalid");

  const nextFont: CustomFontAsset = {
    family: safeFont.family,
    url: safeFont.url,
    uploadedAt: new Date().toISOString(),
  };

  const existingIndex = customization.customFonts.findIndex(
    (item) => item.family.toLowerCase() === safeFont.family.toLowerCase()
  );

  if (existingIndex >= 0) {
    customization.customFonts[existingIndex] = nextFont;
  } else {
    customization.customFonts.push(nextFont);
  }

  customization.updatedAt = new Date().toISOString();
  await writeSiteCustomization(customization);
  return customization;
}
