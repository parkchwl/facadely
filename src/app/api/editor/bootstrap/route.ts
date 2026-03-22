import { NextResponse } from "next/server";
import { readTemplateManifest } from "@/lib/template-manifest-store";
import {
  BackendSiteApiError,
  getOwnedSiteCustomizationFromBackend,
  getSitePublishStateFromBackend,
  listUserSitesFromBackend,
} from "@/lib/server/site-backend";
import { requireAuthenticatedUser } from "@/lib/server/api-security";
import type { UserSiteRecord } from "@/lib/user-site-store";

function pickActiveSite(
  sites: UserSiteRecord[],
  requestedSiteId: string,
  requestedSitePath: string
): UserSiteRecord | null {
  if (requestedSiteId) {
    const matchedById = sites.find((site) => site.id === requestedSiteId);
    if (matchedById) return matchedById;
  }

  if (requestedSitePath) {
    const matchedByPath = sites.find((site) => site.sitePath === requestedSitePath);
    if (matchedByPath) return matchedByPath;
  }

  return sites[0] ?? null;
}

export async function GET(req: Request) {
  try {
    await requireAuthenticatedUser(req);
    const cookieHeader = req.headers.get("cookie") ?? "";
    const { searchParams } = new URL(req.url);
    const requestedSiteId = searchParams.get("siteId")?.trim() ?? "";
    const requestedSitePath = searchParams.get("sitePath")?.trim() ?? "";

    const sites = await listUserSitesFromBackend(cookieHeader);
    const activeSite = pickActiveSite(sites, requestedSiteId, requestedSitePath);

    if (!activeSite) {
      return NextResponse.json({
        success: true,
        sites,
        activeSite: null,
        manifest: null,
        customization: null,
        publish: null,
      });
    }

    const [manifest, customization, publish] = await Promise.all([
      readTemplateManifest(activeSite.templatePath),
      getOwnedSiteCustomizationFromBackend(cookieHeader, {
        siteId: activeSite.id,
        sitePath: activeSite.sitePath,
      }),
      getSitePublishStateFromBackend(cookieHeader, {
        siteId: activeSite.id,
        sitePath: activeSite.sitePath,
      }),
    ]);

    return NextResponse.json({
      success: true,
      sites,
      activeSite,
      manifest,
      customization,
      publish,
    });
  } catch (error) {
    if (error instanceof BackendSiteApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    console.error("editor bootstrap GET error:", error);
    return NextResponse.json({ error: "Failed to load editor bootstrap data" }, { status: 500 });
  }
}
