import type { SiteCustomization } from "@/lib/site-customization-types";
import type { UserSiteRecord } from "@/lib/user-site-store";

const DEFAULT_API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.facadely.com/api/v1"
    : "http://localhost:8080/api/v1";

const INTERNAL_API_BASE_URL = (
  process.env.INTERNAL_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  DEFAULT_API_BASE_URL
).replace(/\/$/, "");

export class BackendSiteApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export type SitePublishRecord = {
  siteId: string;
  sitePath: string;
  lifecycleStatus: "DRAFT" | "PUBLISHED" | string;
  published: boolean;
  publishedSlug: string | null;
  customDomain: string | null;
  publishedAt: string | null;
  updatedAt: string;
};

export type PublishedSiteRecord = {
  sitePath: string;
  name: string;
  templateId: string;
  templateSlug: string;
  publishedSlug: string;
  customDomain: string | null;
  publishedAt: string | null;
};

type BackendSiteEnvelope = {
  sites?: UserSiteRecord[];
  site?: UserSiteRecord;
  publish?: SitePublishRecord;
  publishedSite?: PublishedSiteRecord;
  customization?: SiteCustomization;
  code?: string;
  error?: string;
  message?: string;
};

async function parseEnvelope(response: Response): Promise<BackendSiteEnvelope | null> {
  return response.json().catch(() => null) as Promise<BackendSiteEnvelope | null>;
}

function getErrorMessage(payload: BackendSiteEnvelope | null, fallback: string): string {
  return payload?.error ?? payload?.message ?? fallback;
}

async function fetchSiteApi(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${INTERNAL_API_BASE_URL}/sites${path}`, {
    cache: "no-store",
    ...init,
  });
}

export async function listUserSitesFromBackend(cookieHeader: string): Promise<UserSiteRecord[]> {
  const response = await fetchSiteApi("", {
    method: "GET",
    headers: {
      cookie: cookieHeader,
    },
  });

  const payload = await parseEnvelope(response);
  if (!response.ok) {
    throw new BackendSiteApiError(response.status, getErrorMessage(payload, "Failed to load sites"));
  }

  return payload?.sites ?? [];
}

export async function createUserSiteFromBackend(
  cookieHeader: string,
  templateId: string
): Promise<UserSiteRecord> {
  const response = await fetchSiteApi("", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: cookieHeader,
    },
    body: JSON.stringify({ templateId }),
  });

  const payload = await parseEnvelope(response);
  if (!response.ok || !payload?.site) {
    throw new BackendSiteApiError(response.status, getErrorMessage(payload, "Failed to create site"));
  }

  return payload.site;
}

export async function updateUserSiteInBackend(
  cookieHeader: string,
  siteId: string,
  body: { name: string }
): Promise<UserSiteRecord> {
  const response = await fetchSiteApi(`/${siteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      cookie: cookieHeader,
    },
    body: JSON.stringify(body),
  });

  const payload = await parseEnvelope(response);
  if (!response.ok || !payload?.site) {
    throw new BackendSiteApiError(response.status, getErrorMessage(payload, "Failed to update site"));
  }

  return payload.site;
}

export async function deleteUserSiteFromBackend(cookieHeader: string, siteId: string): Promise<void> {
  const response = await fetchSiteApi(`/${siteId}`, {
    method: "DELETE",
    headers: {
      cookie: cookieHeader,
    },
  });

  if (!response.ok) {
    const payload = await parseEnvelope(response);
    throw new BackendSiteApiError(response.status, getErrorMessage(payload, "Failed to delete site"));
  }
}

export async function getSitePublishStateFromBackend(
  cookieHeader: string,
  sitePath: string
): Promise<SitePublishRecord> {
  const response = await fetchSiteApi(`/publish?sitePath=${encodeURIComponent(sitePath)}`, {
    method: "GET",
    headers: {
      cookie: cookieHeader,
    },
  });

  const payload = await parseEnvelope(response);
  if (!response.ok || !payload?.publish) {
    throw new BackendSiteApiError(response.status, getErrorMessage(payload, "Failed to load publish state"));
  }

  return payload.publish;
}

export async function publishSiteOnBackend(
  cookieHeader: string,
  body: { sitePath: string; customDomain?: string }
): Promise<SitePublishRecord> {
  const response = await fetchSiteApi("/publish", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: cookieHeader,
    },
    body: JSON.stringify(body),
  });

  const payload = await parseEnvelope(response);
  if (!response.ok || !payload?.publish) {
    throw new BackendSiteApiError(response.status, getErrorMessage(payload, "Failed to publish site"));
  }

  return payload.publish;
}

export async function unpublishSiteOnBackend(
  cookieHeader: string,
  sitePath: string
): Promise<SitePublishRecord> {
  const response = await fetchSiteApi(`/publish?sitePath=${encodeURIComponent(sitePath)}`, {
    method: "DELETE",
    headers: {
      cookie: cookieHeader,
    },
  });

  const payload = await parseEnvelope(response);
  if (!response.ok || !payload?.publish) {
    throw new BackendSiteApiError(response.status, getErrorMessage(payload, "Failed to unpublish site"));
  }

  return payload.publish;
}

export async function getPublishedSiteBySlugFromBackend(slug: string): Promise<PublishedSiteRecord | null> {
  const response = await fetchSiteApi(`/public/${encodeURIComponent(slug)}`, {
    method: "GET",
  });

  if (response.status === 404) {
    return null;
  }

  const payload = await parseEnvelope(response);
  if (!response.ok || !payload?.publishedSite) {
    throw new BackendSiteApiError(response.status, getErrorMessage(payload, "Failed to load published site"));
  }

  return payload.publishedSite;
}

export async function getSiteCustomizationFromBackend(sitePath: string): Promise<SiteCustomization> {
  const response = await fetchSiteApi(`/customization?sitePath=${encodeURIComponent(sitePath)}`, {
    method: "GET",
  });

  const payload = await parseEnvelope(response);
  if (!response.ok || !payload?.customization) {
    throw new BackendSiteApiError(response.status, getErrorMessage(payload, "Failed to load site customization"));
  }

  return payload.customization;
}

export async function saveSiteCustomizationToBackend(
  cookieHeader: string,
  body: Record<string, unknown>
): Promise<SiteCustomization> {
  const response = await fetchSiteApi("/customization", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: cookieHeader,
    },
    body: JSON.stringify(body),
  });

  const payload = await parseEnvelope(response);
  if (!response.ok || !payload?.customization) {
    throw new BackendSiteApiError(response.status, getErrorMessage(payload, "Failed to save site customization"));
  }

  return payload.customization;
}
