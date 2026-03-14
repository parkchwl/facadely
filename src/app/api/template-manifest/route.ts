import { NextResponse } from "next/server";
import { readTemplateManifest } from "@/lib/template-manifest-store";
import { requireAuthenticatedUser } from "@/lib/server/api-security";
import { resolveTemplateSourcePath } from "@/lib/user-site-store";

export async function GET(req: Request) {
  try {
    await requireAuthenticatedUser(req);
    const { searchParams } = new URL(req.url);
    const sitePath = searchParams.get("sitePath");

    if (!sitePath) {
      return NextResponse.json({ error: "sitePath is required" }, { status: 400 });
    }

    const templateSourcePath = await resolveTemplateSourcePath(sitePath);
    const manifest = await readTemplateManifest(templateSourcePath);
    if (!manifest) {
      return NextResponse.json({ error: "Template manifest not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, manifest });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    console.error("template-manifest GET error:", error);
    return NextResponse.json({ error: "Failed to load template manifest" }, { status: 500 });
  }
}
