type ReactTemplateRegistryEntry = {
  templateId: string;
  slug: string;
  legacyPath: string;
  name: string;
  description: string;
};

const REACT_TEMPLATE_REGISTRY: ReactTemplateRegistryEntry[] = [
  {
    templateId: "main-page",
    slug: "velocity-saas-landing",
    legacyPath: "/6",
    name: "Velocity SaaS Landing",
    description: "Dark SaaS landing template with hero, feature grid, and social proof",
  },
  {
    templateId: "nexus-ai-enterprise",
    slug: "nexus-ai-enterprise",
    legacyPath: "/5",
    name: "Nexus AI Enterprise",
    description: "Dark enterprise AI consulting landing template",
  },
  {
    templateId: "onepro-dashboard-white",
    slug: "onepro-dashboard-white",
    legacyPath: "/7",
    name: "OnePro Dashboard",
    description: "SaaS dashboard hero template",
  },
];

const DEFAULT_TEMPLATE_ID = "main-page";

const bySlug = new Map(REACT_TEMPLATE_REGISTRY.map((entry) => [entry.slug, entry]));
const byLegacyPath = new Map(
  REACT_TEMPLATE_REGISTRY.map((entry) => [entry.legacyPath, entry])
);
const byTemplateId = new Map(
  REACT_TEMPLATE_REGISTRY.map((entry) => [entry.templateId, entry])
);

function normalizePath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) return "";
  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const normalized = withLeadingSlash.replace(/\/+/g, "/");
  if (normalized.length > 1 && normalized.endsWith("/")) {
    return normalized.slice(0, -1);
  }
  return normalized;
}

function extractCanonicalSlug(path: string): string | null {
  const normalized = normalizePath(path);
  const parts = normalized.split("/").filter(Boolean);
  if (parts.length === 2 && parts[0] === "s") {
    return parts[1];
  }
  return null;
}

function getDefaultTemplateEntry(): ReactTemplateRegistryEntry {
  return byTemplateId.get(DEFAULT_TEMPLATE_ID) ?? REACT_TEMPLATE_REGISTRY[0];
}

export function listReactTemplateRegistry(): ReactTemplateRegistryEntry[] {
  return [...REACT_TEMPLATE_REGISTRY];
}

export function getTemplateBySlug(slug: string): ReactTemplateRegistryEntry | null {
  return bySlug.get(slug) ?? null;
}

export function getTemplateByLegacyPath(path: string): ReactTemplateRegistryEntry | null {
  return byLegacyPath.get(normalizePath(path)) ?? null;
}

export function getTemplateByTemplateId(templateId: string): ReactTemplateRegistryEntry | null {
  return byTemplateId.get(templateId) ?? null;
}

export function getCanonicalPathForTemplateSlug(slug: string): string {
  return `/s/${slug}`;
}

export function getDefaultLegacyTemplatePath(): string {
  return getDefaultTemplateEntry().legacyPath;
}

export function getDefaultCanonicalTemplatePath(): string {
  return getCanonicalPathForTemplateSlug(getDefaultTemplateEntry().slug);
}

export function toLegacyTemplatePath(inputPath: string): string {
  const normalized = normalizePath(inputPath);
  if (!normalized) return getDefaultLegacyTemplatePath();

  const fromLegacy = byLegacyPath.get(normalized);
  if (fromLegacy) return fromLegacy.legacyPath;

  const slug = extractCanonicalSlug(normalized);
  if (!slug) return normalized;

  const fromSlug = bySlug.get(slug);
  if (!fromSlug) return normalized;
  return fromSlug.legacyPath;
}

export function toCanonicalTemplatePath(inputPath: string): string {
  const normalized = normalizePath(inputPath);
  if (!normalized) return getDefaultCanonicalTemplatePath();

  const slug = extractCanonicalSlug(normalized);
  if (slug) {
    return bySlug.has(slug) ? normalized : normalized;
  }

  const fromLegacy = byLegacyPath.get(normalized);
  if (fromLegacy) return getCanonicalPathForTemplateSlug(fromLegacy.slug);

  return normalized;
}

export function listCanonicalTemplateEntries(): Array<
  ReactTemplateRegistryEntry & { canonicalPath: string }
> {
  return REACT_TEMPLATE_REGISTRY.map((entry) => ({
    ...entry,
    canonicalPath: getCanonicalPathForTemplateSlug(entry.slug),
  }));
}
