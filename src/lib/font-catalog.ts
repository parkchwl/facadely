export type EditorFontOption = {
  id: string;
  label: string;
  fontFamily: string;
  category: "sans" | "serif" | "display" | "mono";
  googleHref?: string;
};

export const EDITOR_FONT_OPTIONS: EditorFontOption[] = [
  {
    id: "system-sans",
    label: "System Sans",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, "Noto Sans KR", "Noto Sans", sans-serif',
    category: "sans",
  },
  {
    id: "system-serif",
    label: "System Serif",
    fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    category: "serif",
  },
  {
    id: "inter",
    label: "Inter",
    fontFamily: '"Inter", sans-serif',
    category: "sans",
    googleHref: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
  },
  {
    id: "manrope",
    label: "Manrope",
    fontFamily: '"Manrope", sans-serif',
    category: "sans",
    googleHref: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",
  },
  {
    id: "montserrat",
    label: "Montserrat",
    fontFamily: '"Montserrat", sans-serif',
    category: "sans",
    googleHref: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap",
  },
  {
    id: "dm-sans",
    label: "DM Sans",
    fontFamily: '"DM Sans", sans-serif',
    category: "sans",
    googleHref: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap",
  },
  {
    id: "poppins",
    label: "Poppins",
    fontFamily: '"Poppins", sans-serif',
    category: "sans",
    googleHref: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap",
  },
  {
    id: "playfair-display",
    label: "Playfair Display",
    fontFamily: '"Playfair Display", serif',
    category: "display",
    googleHref: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&display=swap",
  },
  {
    id: "lora",
    label: "Lora",
    fontFamily: '"Lora", serif',
    category: "serif",
    googleHref: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap",
  },
  {
    id: "space-grotesk",
    label: "Space Grotesk",
    fontFamily: '"Space Grotesk", sans-serif',
    category: "display",
    googleHref: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap",
  },
];

function normalizeFontFamily(value: string): string {
  return value.replace(/['"]/g, "").trim().toLowerCase();
}

function includesToken(value: string, token: string): boolean {
  return normalizeFontFamily(value).includes(normalizeFontFamily(token));
}

export function findEditorFontByFamily(value: string): EditorFontOption | null {
  if (!value.trim()) return null;

  const exact = EDITOR_FONT_OPTIONS.find(
    (option) => normalizeFontFamily(option.fontFamily) === normalizeFontFamily(value)
  );
  if (exact) return exact;

  return (
    EDITOR_FONT_OPTIONS.find((option) => {
      const primaryToken = option.fontFamily.split(",")[0];
      return includesToken(value, primaryToken);
    }) ?? null
  );
}

export function editorFontGoogleHrefMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const option of EDITOR_FONT_OPTIONS) {
    if (!option.googleHref) continue;
    const primaryToken = option.fontFamily.split(",")[0]?.replace(/['"]/g, "").trim();
    if (!primaryToken) continue;
    map[primaryToken.toLowerCase()] = option.googleHref;
  }
  return map;
}
