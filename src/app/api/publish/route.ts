import { NextResponse } from "next/server";
import { getPublishRecord, publishSite } from "@/lib/publish-store";
import {
  requireAuthenticatedUser,
  requireSameOrigin,
} from "@/lib/server/api-security";

function buildPublicUrl(origin: string, slug: string): string {
  return `${origin}/p/${slug}`;
}

export async function GET(req: Request) {
  try {
    await requireAuthenticatedUser(req);
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
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    console.error("publish GET error:", error);
    return NextResponse.json({ error: "Failed to load publish state" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    requireSameOrigin(req);
    await requireAuthenticatedUser(req);
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
    if (error instanceof Error && (error.message === "FORBIDDEN_ORIGIN" || error.message === "MISSING_ORIGIN")) {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Invalid custom domain format") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("publish POST error:", error);
    return NextResponse.json({ error: "Failed to publish site" }, { status: 500 });
  }
}
