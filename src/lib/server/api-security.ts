type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  termsAgreed: boolean;
};

const INTERNAL_API_BASE_URL = (
  process.env.INTERNAL_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8080/api/v1"
).replace(/\/$/, "");

function trimTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function requireSameOrigin(request: Request): void {
  let requestOrigin = "";

  try {
    requestOrigin = trimTrailingSlash(new URL(request.url).origin);
  } catch {
    throw new Error("FORBIDDEN_ORIGIN");
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const fetchSite = request.headers.get("sec-fetch-site");

  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "same-site") {
    throw new Error("FORBIDDEN_ORIGIN");
  }

  if (origin) {
    if (trimTrailingSlash(origin) !== requestOrigin) {
      throw new Error("FORBIDDEN_ORIGIN");
    }
    return;
  }

  if (referer) {
    try {
      const refererOrigin = trimTrailingSlash(new URL(referer).origin);
      if (refererOrigin !== requestOrigin) {
        throw new Error("FORBIDDEN_ORIGIN");
      }
      return;
    } catch {
      throw new Error("FORBIDDEN_ORIGIN");
    }
  }

  throw new Error("MISSING_ORIGIN");
}

export async function requireAuthenticatedUser(request: Request): Promise<AuthenticatedUser> {
  const cookie = request.headers.get("cookie") || "";
  const response = await fetch(`${INTERNAL_API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      cookie,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("UNAUTHORIZED");
  }

  return response.json() as Promise<AuthenticatedUser>;
}

export function isTemplateCodegenEnabled(): boolean {
  return process.env.FACADELY_ENABLE_TEMPLATE_CODEGEN === "true";
}
