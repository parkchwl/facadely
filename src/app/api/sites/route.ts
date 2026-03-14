import { NextResponse } from "next/server";
import { requireAuthenticatedUser, requireSameOrigin } from "@/lib/server/api-security";
import {
  BackendSiteApiError,
  createUserSiteFromBackend,
  listUserSitesFromBackend,
} from "@/lib/server/site-backend";

export async function GET(req: Request) {
  try {
    await requireAuthenticatedUser(req);
    const cookieHeader = req.headers.get("cookie") ?? "";
    const sites = await listUserSitesFromBackend(cookieHeader);
    return NextResponse.json({ sites });
  } catch (error) {
    if (error instanceof BackendSiteApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    console.error("sites GET error:", error);
    return NextResponse.json({ error: "Failed to load sites" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    requireSameOrigin(req);
    await requireAuthenticatedUser(req);
    const body = (await req.json()) as { templateId?: string };
    const templateId = typeof body.templateId === "string" ? body.templateId.trim() : "";

    if (!templateId) {
      return NextResponse.json({ error: "templateId is required" }, { status: 400 });
    }

    const cookieHeader = req.headers.get("cookie") ?? "";
    const site = await createUserSiteFromBackend(cookieHeader, templateId);
    return NextResponse.json({ success: true, site });
  } catch (error) {
    if (error instanceof BackendSiteApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof Error && (error.message === "FORBIDDEN_ORIGIN" || error.message === "MISSING_ORIGIN")) {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    console.error("sites POST error:", error);
    return NextResponse.json({ error: "Failed to create site" }, { status: 500 });
  }
}
