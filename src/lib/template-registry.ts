export type ReactTemplateRegistryEntry = {
  templateId: string;
  slug: string;
  legacyPath: string;
  name: string;
  description: string;
  previewImage: string;
};

const REACT_TEMPLATE_REGISTRY: ReactTemplateRegistryEntry[] = [
  {
    templateId: "velocity-saas-landing",
    slug: "velocity-saas-landing",
    legacyPath: "/6",
    name: "Velocity SaaS Landing",
    description: "Dark SaaS landing template with hero, feature grid, and social proof",
    previewImage: "/template-previews/velocity-saas-landing.jpg",
  },
  {
    templateId: "nexus-ai-enterprise",
    slug: "nexus-ai-enterprise",
    legacyPath: "/5",
    name: "Nexus AI Enterprise",
    description: "Dark enterprise AI consulting landing template",
    previewImage: "/template-previews/nexus-ai-enterprise.jpg",
  },
  {
    templateId: "onepro-dashboard-white",
    slug: "onepro-dashboard-white",
    legacyPath: "/7",
    name: "OnePro Dashboard",
    description: "SaaS dashboard hero template",
    previewImage: "/template-previews/onepro-dashboard-white.jpg",
  },
  {
    templateId: "ion-modern-product",
    slug: "ion-modern-product",
    legacyPath: "/2",
    name: "Modern Product Landing",
    description: "Dark premium product landing page with performance storytelling and technical feature panels",
    previewImage: "/template-previews/ion-modern-product.jpg",
  },
  {
    templateId: "nocturne-typography-agency",
    slug: "nocturne-typography-agency",
    legacyPath: "/s/nocturne-typography-agency",
    name: "Typography Agency",
    description: "Cinematic dark portfolio template with editorial typography and luxury creative studio layouts",
    previewImage: "/template-previews/nocturne-typography-agency.jpg",
  },
  {
    templateId: "verdant-ecommerce-editorial",
    slug: "verdant-ecommerce-editorial",
    legacyPath: "/s/verdant-ecommerce-editorial",
    name: "E-Commerce Editorial",
    description: "Organic wellness e-commerce template with soft editorial product storytelling",
    previewImage: "/template-previews/verdant-ecommerce-editorial.jpg",
  },
  {
    templateId: "sejour-luxury-wellness-resort",
    slug: "sejour-luxury-wellness-resort",
    legacyPath: "/8",
    name: "Luxury Wellness Resort",
    description: "High-end hospitality landing page with serene hero imagery and curated resort sections",
    previewImage: "/template-previews/sejour-luxury-wellness-resort.jpg",
  },
  {
    templateId: "vault-fintech-dashboard",
    slug: "vault-fintech-dashboard",
    legacyPath: "/9",
    name: "Fintech Dashboard Landing",
    description: "Modern fintech landing page with dashboard preview, pricing tiers, and finance-focused feature sections",
    previewImage: "/template-previews/vault-fintech-dashboard.svg",
  },
  {
    templateId: "serenica-wellness-retreat",
    slug: "serenica-wellness-retreat",
    legacyPath: "/14",
    name: "Serenica Wellness Retreat",
    description: "Calm wellness landing page with cinematic hero imagery and restorative sections",
    previewImage: "/template-previews/serenica-wellness-retreat.jpg",
  },
  {
    templateId: "rekolet-brutalism",
    slug: "rekolet-brutalism",
    legacyPath: "/17",
    name: "Rekolet Brutalism",
    description: "Dark brutalist studio template with oversized typography, glass card hero, and recognition wall",
    previewImage: "/template-previews/rekolet-brutalism.jpg",
  },
  {
    templateId: "nordhaven-architecture",
    slug: "nordhaven-architecture",
    legacyPath: "/18",
    name: "Nordhaven Architecture",
    description: "Scandinavian architecture showcase with masked hero lettering and editorial sections",
    previewImage: "/template-previews/nordhaven-architecture.jpg",
  },
  {
    templateId: "de-colorado-real-estate",
    slug: "de-colorado-real-estate",
    legacyPath: "/20",
    name: "De Colorado Real Estate",
    description: "Luxury real estate landing page with split-tone storytelling and editorial imagery",
    previewImage: "/template-previews/de-colorado-real-estate.jpg",
  },
  {
    templateId: "flato-minimalist-cabin",
    slug: "flato-minimalist-cabin",
    legacyPath: "/21",
    name: "Flato Minimalist Cabin",
    description: "Minimal real estate and architecture template with overlapped hero typography and asymmetrical gallery layout",
    previewImage: "/template-previews/flato-minimalist-cabin.jpg",
  },
  {
    templateId: "formark-architect-agency",
    slug: "formark-architect-agency",
    legacyPath: "/22",
    name: "Formark Architect Agency",
    description: "Brutalist architecture agency landing page with neon marquee and gallery storytelling",
    previewImage: "/template-previews/formark-architect-agency.jpg",
  },
];

const DEFAULT_TEMPLATE_ID = "velocity-saas-landing";

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
