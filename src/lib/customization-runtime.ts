import { SiteCustomization } from "@/lib/site-customization-types";

const TYPOGRAPHY_STYLE_TAG_ID = "facadely-typography-style";
const CUSTOM_FONT_STYLE_TAG_ID = "facadely-custom-font-style";
const TYPOGRAPHY_ROOT_VARS = [
  "--type-heading-font",
  "--type-heading-weight",
  "--type-heading-size",
  "--type-heading-line-height",
  "--type-heading-letter-spacing",
  "--type-body-font",
  "--type-body-weight",
  "--type-body-size",
  "--type-body-line-height",
  "--type-body-letter-spacing",
  "--type-button-font",
  "--type-button-weight",
  "--type-button-size",
  "--type-button-line-height",
  "--type-button-letter-spacing",
] as const;

function escapeCssString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export function applyCustomFontFaces(doc: Document, customization: SiteCustomization): void {
  const head = doc.head;
  if (!head) return;

  const fonts = customization.customFonts ?? [];
  if (!fonts.length) return;

  let styleTag = doc.getElementById(CUSTOM_FONT_STYLE_TAG_ID) as HTMLStyleElement | null;
  if (!styleTag) {
    styleTag = doc.createElement("style");
    styleTag.id = CUSTOM_FONT_STYLE_TAG_ID;
    head.appendChild(styleTag);
  }

  const css = fonts
    .map((font) => {
      const family = escapeCssString(font.family);
      const url = escapeCssString(font.url);
      return `@font-face{font-family:"${family}";src:url("${url}") format("woff2");font-display:swap;}`;
    })
    .join("");

  if (styleTag.textContent !== css) {
    styleTag.textContent = css;
  }
}

export function applyTypographyTokens(doc: Document, customization: SiteCustomization): void {
  const root = doc.body ?? doc.documentElement;
  const head = doc.head;
  if (!root || !head) return;

  const tokens = customization.typographyTokens;
  if (!tokens) return;

  root.style.setProperty("--type-heading-font", tokens.heading.fontFamily);
  root.style.setProperty("--type-heading-weight", tokens.heading.fontWeight);
  root.style.setProperty("--type-heading-size", tokens.heading.fontSize);
  root.style.setProperty("--type-heading-line-height", tokens.heading.lineHeight);
  root.style.setProperty("--type-heading-letter-spacing", tokens.heading.letterSpacing);

  root.style.setProperty("--type-body-font", tokens.body.fontFamily);
  root.style.setProperty("--type-body-weight", tokens.body.fontWeight);
  root.style.setProperty("--type-body-size", tokens.body.fontSize);
  root.style.setProperty("--type-body-line-height", tokens.body.lineHeight);
  root.style.setProperty("--type-body-letter-spacing", tokens.body.letterSpacing);

  root.style.setProperty("--type-button-font", tokens.button.fontFamily);
  root.style.setProperty("--type-button-weight", tokens.button.fontWeight);
  root.style.setProperty("--type-button-size", tokens.button.fontSize);
  root.style.setProperty("--type-button-line-height", tokens.button.lineHeight);
  root.style.setProperty("--type-button-letter-spacing", tokens.button.letterSpacing);

  let styleTag = doc.getElementById(TYPOGRAPHY_STYLE_TAG_ID) as HTMLStyleElement | null;
  if (!styleTag) {
    styleTag = doc.createElement("style");
    styleTag.id = TYPOGRAPHY_STYLE_TAG_ID;
    head.appendChild(styleTag);
  }

  const css = `
    :where(h1,h2,h3,h4,h5,h6) {
      font-family: var(--type-heading-font) !important;
      font-weight: var(--type-heading-weight) !important;
      font-size: var(--type-heading-size) !important;
      line-height: var(--type-heading-line-height) !important;
      letter-spacing: var(--type-heading-letter-spacing) !important;
    }
    :where(p,li,span,small,label,blockquote,figcaption) {
      font-family: var(--type-body-font) !important;
      font-weight: var(--type-body-weight) !important;
      font-size: var(--type-body-size) !important;
      line-height: var(--type-body-line-height) !important;
      letter-spacing: var(--type-body-letter-spacing) !important;
    }
    :where(button,a,[role="button"],input[type="button"],input[type="submit"]) {
      font-family: var(--type-button-font) !important;
      font-weight: var(--type-button-weight) !important;
      font-size: var(--type-button-size) !important;
      line-height: var(--type-button-line-height) !important;
      letter-spacing: var(--type-button-letter-spacing) !important;
    }
  `.trim();

  if (styleTag.textContent !== css) {
    styleTag.textContent = css;
  }
}

export function clearTypographyOverrides(doc: Document): void {
  const styleTag = doc.getElementById(TYPOGRAPHY_STYLE_TAG_ID);
  if (styleTag?.parentElement) {
    styleTag.parentElement.removeChild(styleTag);
  }

  const rootTargets = [doc.body, doc.documentElement].filter(
    (target): target is HTMLElement => Boolean(target)
  );
  if (rootTargets.length === 0) return;
  for (const cssVar of TYPOGRAPHY_ROOT_VARS) {
    for (const root of rootTargets) {
      root.style.removeProperty(cssVar);
    }
  }
}
