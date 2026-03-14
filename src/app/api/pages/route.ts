import { NextResponse } from "next/server";
import {
    requireAuthenticatedUser,
    requireSameOrigin,
} from "@/lib/server/api-security";
import { BackendSiteApiError, listUserSitesFromBackend } from "@/lib/server/site-backend";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
    try {
        await requireAuthenticatedUser(req);
        const cookieHeader = req.headers.get("cookie") ?? "";
        const pages = (await listUserSitesFromBackend(cookieHeader)).map((site) => ({
            id: site.id,
            name: site.name,
            desc: site.description,
            path: site.sitePath,
        }));
        return NextResponse.json({ pages });

    } catch (error) {
        if (error instanceof BackendSiteApiError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }
        console.error("Pages API Error:", error);
        return NextResponse.json({ error: "Failed to list pages" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        requireSameOrigin(req);
        await requireAuthenticatedUser(req);
        return NextResponse.json(
            { error: "Custom page creation is not supported in the current site workflow." },
            { status: 410 }
        );

    } catch (error) {
        if (error instanceof Error && (error.message === "FORBIDDEN_ORIGIN" || error.message === "MISSING_ORIGIN")) {
            return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
        }
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }
        console.error("Create Page Error:", error);
        return NextResponse.json({ error: "Failed to create new page" }, { status: 500 });
    }
}
