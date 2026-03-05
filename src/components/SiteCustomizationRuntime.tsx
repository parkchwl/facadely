"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { SiteCustomization } from "@/lib/site-customization-types";
import { findEditorFontByFamily } from "@/lib/font-catalog";
import {
  applyCustomFontFaces,
  applyTypographyTokens,
  clearTypographyOverrides,
} from "@/lib/customization-runtime";

const TOKEN_TO_CSS_VAR = {
  primary: "--primary",
  secondary: "--secondary",
  radius: "--radius",
  spacingBase: "--spacing-base",
} as const;

function loadFontsFromCustomization(customization: SiteCustomization): void {
  const typographyFonts = [
    customization.typographyTokens?.heading.fontFamily,
    customization.typographyTokens?.body.fontFamily,
    customization.typographyTokens?.button.fontFamily,
  ].filter((value): value is string => typeof value === "string" && value.trim().length > 0);

  for (const fontFamily of typographyFonts) {
    const matched = findEditorFontByFamily(fontFamily);
    if (!matched?.googleHref) continue;

    const linkId = `facadely-runtime-font-${matched.id}`;
    if (document.getElementById(linkId)) continue;

    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = matched.googleHref;
    document.head.appendChild(link);
  }

  for (const patch of customization.elements) {
    const fontFamily = patch.styles.fontFamily;
    if (typeof fontFamily !== "string" || !fontFamily.trim()) continue;
    const matched = findEditorFontByFamily(fontFamily);
    if (!matched?.googleHref) continue;

    const linkId = `facadely-runtime-font-${matched.id}`;
    if (document.getElementById(linkId)) continue;

    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = matched.googleHref;
    document.head.appendChild(link);
  }
}

function applyCustomization(customization: SiteCustomization): void {
  loadFontsFromCustomization(customization);
  applyCustomFontFaces(document, customization);
  if (customization.typographyPresetEnabled) {
    applyTypographyTokens(document, customization);
  } else {
    clearTypographyOverrides(document);
  }

  const root = document.body ?? document.documentElement;
  root.style.setProperty(TOKEN_TO_CSS_VAR.primary, customization.themeTokens.primary);
  root.style.setProperty(TOKEN_TO_CSS_VAR.secondary, customization.themeTokens.secondary);
  root.style.setProperty(TOKEN_TO_CSS_VAR.radius, customization.themeTokens.radius);
  root.style.setProperty(TOKEN_TO_CSS_VAR.spacingBase, customization.themeTokens.spacingBase);

  for (const patch of customization.elements) {
    const escapedEditId =
      typeof CSS !== "undefined" && typeof CSS.escape === "function"
        ? CSS.escape(patch.editId)
        : patch.editId;
    const target = document.querySelector<HTMLElement>(`[data-edit-id="${escapedEditId}"]`);
    if (!target) continue;

    for (const [property, value] of Object.entries(patch.styles)) {
      target.style.setProperty(
        property.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`),
        value
      );
    }

    if (typeof patch.innerText === "string") {
      target.innerText = patch.innerText;
    }

    const tagName = target.tagName.toLowerCase();
    if (typeof patch.src === "string" && tagName === "img") {
      (target as HTMLImageElement).src = patch.src;
    }

    if (typeof patch.href === "string" && tagName === "a") {
      target.setAttribute("href", patch.href);
    }
  }

}

export default function SiteCustomizationRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname === "/") return;

    const controller = new AbortController();

    fetch(`/api/save-code?sitePath=${encodeURIComponent(pathname)}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        const customization = payload?.customization as SiteCustomization | undefined;
        if (!customization) return;
        applyCustomization(customization);
      })
      .catch((error) => {
        if (error instanceof Error && error.name === "AbortError") return;
        console.warn("Failed to apply site customization:", error);
      });

    return () => controller.abort();
  }, [pathname]);

  return null;
}
