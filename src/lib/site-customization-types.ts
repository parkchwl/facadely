export type ThemeTokens = {
  primary: string;
  secondary: string;
  radius: string;
  spacingBase: string;
};

export type TypographyPreset = {
  fontFamily: string;
  fontWeight: string;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
};

export type TypographyTokens = {
  heading: TypographyPreset;
  body: TypographyPreset;
  button: TypographyPreset;
};

export type CustomFontAsset = {
  family: string;
  url: string;
  uploadedAt: string;
};

export type ElementPatch = {
  editId: string;
  styles: Record<string, string>;
  innerText?: string;
  src?: string;
  href?: string;
  updatedAt: string;
};

export type SiteCustomization = {
  sitePath: string;
  themeTokens: ThemeTokens;
  typographyTokens: TypographyTokens;
  typographyPresetEnabled: boolean;
  customFonts: CustomFontAsset[];
  elements: ElementPatch[];
  updatedAt: string;
};

export const DEFAULT_THEME_TOKENS: ThemeTokens = {
  primary: "#6366f1",
  secondary: "#d946ef",
  radius: "0.5rem",
  spacingBase: "1rem",
};

export const DEFAULT_TYPOGRAPHY_TOKENS: TypographyTokens = {
  heading: {
    fontFamily: '"Playfair Display", serif',
    fontWeight: "700",
    fontSize: "48px",
    lineHeight: "1.08",
    letterSpacing: "-0.01em",
  },
  body: {
    fontFamily: '"Inter", sans-serif',
    fontWeight: "400",
    fontSize: "16px",
    lineHeight: "1.65",
    letterSpacing: "0px",
  },
  button: {
    fontFamily: '"Inter", sans-serif',
    fontWeight: "600",
    fontSize: "14px",
    lineHeight: "1.2",
    letterSpacing: "0px",
  },
};

export function cloneDefaultTypographyTokens(): TypographyTokens {
  return {
    heading: { ...DEFAULT_TYPOGRAPHY_TOKENS.heading },
    body: { ...DEFAULT_TYPOGRAPHY_TOKENS.body },
    button: { ...DEFAULT_TYPOGRAPHY_TOKENS.button },
  };
}

export function buildDefaultSiteCustomization(sitePath: string): SiteCustomization {
  return {
    sitePath,
    themeTokens: { ...DEFAULT_THEME_TOKENS },
    typographyTokens: cloneDefaultTypographyTokens(),
    typographyPresetEnabled: false,
    customFonts: [],
    elements: [],
    updatedAt: new Date().toISOString(),
  };
}
