import { NextResponse } from "next/server";
import { readTemplateManifest } from "@/lib/template-manifest-store";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sitePath = searchParams.get("sitePath");

    if (!sitePath) {
      return NextResponse.json({ error: "sitePath is required" }, { status: 400 });
    }

    const manifest = await readTemplateManifest(sitePath);
    if (!manifest) {
      return NextResponse.json({ error: "Template manifest not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, manifest });
  } catch (error) {
    console.error("template-manifest GET error:", error);
    return NextResponse.json({ error: "Failed to load template manifest" }, { status: 500 });
  }
}
