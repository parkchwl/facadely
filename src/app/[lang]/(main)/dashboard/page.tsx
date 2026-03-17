import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardWorkspaceClient, {
  type DashboardSiteCard,
} from "@/app/components/DashboardWorkspaceClient";
import { createLocalizedPath, createLoginPathWithNext } from "@/lib/auth-redirect";
import { i18n, type Locale } from "@/i18n/config";
import { getTemplateByTemplateId } from "@/lib/template-registry";
import { listUserSitesFromBackend } from "@/lib/server/site-backend";

const DEFAULT_API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.facadely.com/api/v1"
    : "http://localhost:8080/api/v1";

const INTERNAL_API_BASE_URL = (
  process.env.INTERNAL_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  DEFAULT_API_BASE_URL
).replace(/\/$/, "");

type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  termsAgreed: boolean;
};

function getDisplayName(user: AuthenticatedUser): string {
  const trimmed = user.name?.trim();
  if (trimmed) return trimmed;
  return user.email.split("@")[0] || "Builder";
}

function getDashboardVariant(templateId: string): DashboardSiteCard["variant"] {
  if (templateId === "onepro-dashboard-white") {
    return "dashboard";
  }
  if (templateId === "velocity-saas-landing") {
    return "velocity";
  }
  return "generic";
}

async function fetchAuthenticatedUser(cookieHeader: string): Promise<AuthenticatedUser> {
  const response = await fetch(`${INTERNAL_API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("UNAUTHORIZED");
  }

  return (await response.json()) as AuthenticatedUser;
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const resolvedLang = i18n.locales.includes(lang) ? lang : i18n.defaultLocale;

  const dashboardPath = createLocalizedPath(resolvedLang, "/dashboard");
  const loginPathWithNext = createLoginPathWithNext(resolvedLang, dashboardPath);
  const homeHref = createLocalizedPath(resolvedLang, "/");
  const templatesHref = createLocalizedPath(resolvedLang, "/templates");

  const requestHeaders = await headers();
  const cookieHeader = requestHeaders.get("cookie") ?? "";

  if (!cookieHeader) {
    redirect(loginPathWithNext);
  }

  let user: AuthenticatedUser;

  try {
    user = await fetchAuthenticatedUser(cookieHeader);
  } catch {
    redirect(loginPathWithNext);
  }

  const displayName = getDisplayName(user);
  const initials = displayName.slice(0, 2).toUpperCase();
  const userSites = await listUserSitesFromBackend(cookieHeader).catch(() => []);
  const siteCards: DashboardSiteCard[] = userSites.map((site) => {
    const template = getTemplateByTemplateId(site.templateId);

    return {
      id: site.id,
      name: site.name,
      siteHref: site.sitePath,
      editorHref: `/editor?sitePath=${encodeURIComponent(site.sitePath)}`,
      publicHref: site.lifecycleStatus === "PUBLISHED" && site.publishedSlug ? `/p/${site.publishedSlug}` : null,
      status: site.lifecycleStatus === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
      variant: getDashboardVariant(site.templateId),
      metaLabel: template?.name ?? "Template site",
    };
  });

  return (
    <DashboardWorkspaceClient
      accountName={displayName}
      userInitials={initials}
      homeHref={homeHref}
      dashboardHref={dashboardPath}
      templatesHref={templatesHref}
      siteCards={siteCards}
    />
  );
}
