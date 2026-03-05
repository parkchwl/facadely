import { NextResponse } from "next/server";
import { getPublishRecord, publishSite } from "@/lib/publish-store";

function buildPublicUrl(origin: string, slug: string): string {
  return `${origin}/p/${slug}`;
}

export async function GET(req: Request) {
  try {
    const { searchParams, origin } = new URL(req.url);
    const sitePath = searchParams.get("sitePath");

    if (!sitePath) {
      return NextResponse.json({ error: "sitePath is required" }, { status: 400 });
    }

    const record = await getPublishRecord(sitePath);
    if (!record) {
      return NextResponse.json({ success: true, published: false });
    }

    return NextResponse.json({
      success: true,
      published: true,
      publish: {
        ...record,
        publicUrl: buildPublicUrl(origin, record.publishedSlug),
      },
    });
  } catch (error) {
    console.error("publish GET error:", error);
    return NextResponse.json({ error: "Failed to load publish state" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { sitePath, customDomain } = (await req.json()) as {
      sitePath?: string;
      customDomain?: string;
    };
    if (!sitePath) {
      return NextResponse.json({ error: "sitePath is required" }, { status: 400 });
    }

    const publish = await publishSite(sitePath, customDomain);
    const origin = new URL(req.url).origin;
    const publicUrl = buildPublicUrl(origin, publish.publishedSlug);

    return NextResponse.json({
      success: true,
      publish: {
        ...publish,
        publicUrl,
      },
      domainConnection: publish.customDomain
        ? {
          status: "pending_dns",
          host: publish.customDomain,
          type: "CNAME",
          target: "publish.antigravity.local",
        }
        : null,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid custom domain format") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("publish POST error:", error);
    return NextResponse.json({ error: "Failed to publish site" }, { status: 500 });
  }
}
