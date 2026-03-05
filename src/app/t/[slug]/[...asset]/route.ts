import { NextResponse } from "next/server";
import path from "path";
import { readStaticTemplateBuffer, staticTemplateMimeType, staticTemplateSitePath } from "@/lib/static-template-store";
import { readTemplateManifest } from "@/lib/template-manifest-store";

type RouteContext = {
  params: Promise<{
    slug: string;
    asset: string[];
  }>;
};

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { slug, asset } = await context.params;
    const sitePath = staticTemplateSitePath(slug);
    const manifest = await readTemplateManifest(sitePath);
    if (!manifest || manifest.runtime.format !== "html") {
      return NextResponse.json({ error: "HTML template not found" }, { status: 404 });
    }

    if (!asset || asset.length === 0) {
      return NextResponse.json({ error: "Asset path is required" }, { status: 400 });
    }

    const relativePath = asset.join("/");
    const buffer = await readStaticTemplateBuffer(slug, relativePath);
    const mimeType = staticTemplateMimeType(path.basename(relativePath));
    const body = new Uint8Array(buffer);

    return new NextResponse(body, {
      status: 200,
      headers: {
        "content-type": mimeType,
        "cache-control": "public, max-age=3600",
      },
    });
  } catch (error) {
    if (error instanceof Error && /Invalid template/.test(error.message)) {
      return NextResponse.json({ error: "Invalid asset path" }, { status: 400 });
    }
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }
}
