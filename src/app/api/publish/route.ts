import { NextResponse } from "next/server";
import {
  getSitePublishStateFromBackend,
  publishSiteOnBackend,
  unpublishSiteOnBackend,
  BackendSiteApiError,
} from "@/lib/server/site-backend";
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

    const cookieHeader = req.headers.get("cookie") ?? "";
    const publish = await getSitePublishStateFromBackend(cookieHeader, sitePath);
    if (!publish.published || !publish.publishedSlug) {
      return NextResponse.json({ success: true, published: false });
    }

    return NextResponse.json({
      success: true,
      published: true,
      publish: {
        ...publish,
        publicUrl: buildPublicUrl(origin, publish.publishedSlug),
      },
    });
  } catch (error) {
    if (error instanceof BackendSiteApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
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

    const cookieHeader = req.headers.get("cookie") ?? "";
    const publish = await publishSiteOnBackend(cookieHeader, { sitePath, customDomain });
    if (!publish.publishedSlug) {
      return NextResponse.json({ error: "Publish slug was not created" }, { status: 500 });
    }

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
    if (error instanceof BackendSiteApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof Error && (error.message === "FORBIDDEN_ORIGIN" || error.message === "MISSING_ORIGIN")) {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    console.error("publish POST error:", error);
    return NextResponse.json({ error: "Failed to publish site" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    requireSameOrigin(req);
    await requireAuthenticatedUser(req);
    const { searchParams } = new URL(req.url);
    const sitePath = searchParams.get("sitePath");
    if (!sitePath) {
      return NextResponse.json({ error: "sitePath is required" }, { status: 400 });
    }

    const cookieHeader = req.headers.get("cookie") ?? "";
    const publish = await unpublishSiteOnBackend(cookieHeader, sitePath);

    return NextResponse.json({
      success: true,
      published: false,
      publish,
    });
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
    console.error("publish DELETE error:", error);
    return NextResponse.json({ error: "Failed to unpublish site" }, { status: 500 });
  }
}
