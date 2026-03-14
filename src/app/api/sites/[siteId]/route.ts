import { NextResponse } from "next/server";
import { requireAuthenticatedUser, requireSameOrigin } from "@/lib/server/api-security";
import {
  BackendSiteApiError,
  deleteUserSiteFromBackend,
  updateUserSiteInBackend,
} from "@/lib/server/site-backend";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ siteId: string }> }
) {
  try {
    requireSameOrigin(req);
    await requireAuthenticatedUser(req);
    const { siteId } = await context.params;
    const body = (await req.json()) as { name?: string };
    const name = typeof body.name === "string" ? body.name.trim() : "";

    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const cookieHeader = req.headers.get("cookie") ?? "";
    const site = await updateUserSiteInBackend(cookieHeader, siteId, { name });
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
    console.error("site PATCH error:", error);
    return NextResponse.json({ error: "Failed to update site" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ siteId: string }> }
) {
  try {
    requireSameOrigin(req);
    await requireAuthenticatedUser(req);
    const { siteId } = await context.params;
    const cookieHeader = req.headers.get("cookie") ?? "";
    await deleteUserSiteFromBackend(cookieHeader, siteId);
    return new NextResponse(null, { status: 204 });
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
    console.error("site DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete site" }, { status: 500 });
  }
}
