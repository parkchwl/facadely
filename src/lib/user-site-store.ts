import {
  getTemplateByLegacyPath,
  getTemplateBySlug,
  listReactTemplateRegistry,
  toLegacyTemplatePath,
} from "@/lib/template-registry";

export type UserSiteRecord = {
  id: string;
  ownerUserId: string;
  ownerEmail: string;
  siteSlug: string;
  sitePath: string;
  templateId: string;
  templateSlug: string;
  templatePath: string;
  name: string;
  description: string;
  lifecycleStatus: "DRAFT" | "PUBLISHED" | string;
  publishedSlug: string | null;
  customDomain: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

function normalizePath(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const normalized = withLeadingSlash.replace(/\/+/g, "/");
  return normalized.length > 1 && normalized.endsWith("/")
    ? normalized.slice(0, -1)
    : normalized;
}

export function resolveTemplateSlugFromSiteSlug(siteSlug: string): string | null {
  const normalizedSlug = siteSlug.trim();
  if (!normalizedSlug) return null;

  const exact = getTemplateBySlug(normalizedSlug);
  if (exact) return exact.slug;

  const entries = listReactTemplateRegistry().sort((a, b) => b.slug.length - a.slug.length);
  const matched = entries.find((entry) => normalizedSlug.startsWith(`${entry.slug}-`));
  return matched?.slug ?? null;
}

export function resolveTemplateSourcePath(sitePath: string): string {
  const normalizedPath = normalizePath(sitePath);
  if (!normalizedPath) {
    return toLegacyTemplatePath(sitePath);
  }

  const fromLegacy = getTemplateByLegacyPath(normalizedPath);
  if (fromLegacy) {
    return fromLegacy.legacyPath;
  }

  const parts = normalizedPath.split("/").filter(Boolean);
  if (parts.length === 2 && parts[0] === "s") {
    const templateSlug = resolveTemplateSlugFromSiteSlug(parts[1]);
    if (templateSlug) {
      return toLegacyTemplatePath(`/s/${templateSlug}`);
    }
  }

  return toLegacyTemplatePath(normalizedPath);
}

export function isCanonicalTemplatePath(sitePath: string): boolean {
  const normalizedPath = normalizePath(sitePath);
  if (!normalizedPath) return false;
  if (getTemplateByLegacyPath(normalizedPath)) return true;

  const parts = normalizedPath.split("/").filter(Boolean);
  return parts.length === 2 && parts[0] === "s" && getTemplateBySlug(parts[1]) !== null;
}
