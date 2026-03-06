import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { listTemplateManifests } from "@/lib/template-manifest-store";
import { TEMPLATE_MANIFEST_SCHEMA_VERSION } from "@/lib/template-manifest-types";
import { toCanonicalTemplatePath } from "@/lib/template-registry";
import {
    isTemplateCodegenEnabled,
    requireAuthenticatedUser,
    requireSameOrigin,
} from "@/lib/server/api-security";

const APP_DIR = path.join(process.cwd(), 'src/app');

function toComponentName(slug: string): string {
    const parts = slug
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');

    return `Generated${parts || 'Page'}`;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
    try {
        await requireAuthenticatedUser(req);
        const manifests = await listTemplateManifests();
        const dedupedByPath = new Map<string, {
            id: string;
            name: string;
            desc: string;
            path: string;
        }>();

        manifests
            .filter((manifest) => !manifest.sitePath.startsWith("/t/"))
            .forEach((manifest) => {
                const canonicalPath = toCanonicalTemplatePath(manifest.sitePath);
                dedupedByPath.set(canonicalPath, {
                    id: manifest.templateId,
                    name: manifest.name,
                    desc: manifest.description,
                    path: canonicalPath,
                });
            });

        const pages = Array.from(dedupedByPath.values());
        return NextResponse.json({ pages });

    } catch (error) {
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

        if (!isTemplateCodegenEnabled()) {
            return NextResponse.json(
                { error: "Runtime template code generation is disabled." },
                { status: 403 }
            );
        }

        const { slug, name } = await req.json();
        const normalizedName = typeof name === "string" ? name.trim() : "";

        if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
            return NextResponse.json({ error: "Invalid slug." }, { status: 400 });
        }
        if (!normalizedName || normalizedName.length > 80) {
            return NextResponse.json({ error: "Invalid page name." }, { status: 400 });
        }

        const targetDir = path.join(APP_DIR, slug);

        try {
            await fs.access(targetDir);
            return NextResponse.json({ error: "Directory already exists" }, { status: 409 });
        } catch {
        }

        await fs.mkdir(targetDir, { recursive: true });

        const safeComponentName = toComponentName(slug);
        const pageNameLiteral = JSON.stringify(normalizedName);
        const boilerplateNode = `import React from "react";

const pageName = ${pageNameLiteral};

export default function ${safeComponentName}() {
  return (
    <main className="min-h-screen bg-white text-slate-800 p-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Welcome to {pageName}</h1>
        <p className="text-zinc-600">This is a brand new page. Start dragging blocks from the component library, or edit the text directly.</p>
      </div>
    </main>
  );
}
`;
        await fs.writeFile(path.join(targetDir, 'page.tsx'), boilerplateNode, 'utf8');

        const manifest = {
            schemaVersion: TEMPLATE_MANIFEST_SCHEMA_VERSION,
            templateId: slug,
            sitePath: `/${slug}`,
            name: normalizedName,
            description: "Custom template page",
            runtime: {
                format: "react",
                entry: `src/app/${slug}/page.tsx`,
                deployment: "static",
            },
            editable: [],
            themeTokens: ["primary", "secondary", "radius", "spacingBase"],
        };
        await fs.writeFile(
            path.join(targetDir, "manifest.json"),
            `${JSON.stringify(manifest, null, 2)}\n`,
            "utf8"
        );

        return NextResponse.json({
            success: true,
            page: {
                id: slug,
                name: normalizedName,
                desc: 'Newly created page',
                path: `/${slug}`
            }
        });

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
