import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { listTemplateManifests } from "@/lib/template-manifest-store";
import { TEMPLATE_MANIFEST_SCHEMA_VERSION } from "@/lib/template-manifest-types";
import { toCanonicalTemplatePath } from "@/lib/template-registry";

const APP_DIR = path.join(process.cwd(), 'src/app');

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
    try {
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
        console.error("Pages API Error:", error);
        return NextResponse.json({ error: "Failed to list pages" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { slug, name } = await req.json();

        if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
            return NextResponse.json({ error: "Invalid slug." }, { status: 400 });
        }

        const targetDir = path.join(APP_DIR, slug);

        try {
            await fs.access(targetDir);
            return NextResponse.json({ error: "Directory already exists" }, { status: 409 });
        } catch {
        }

        await fs.mkdir(targetDir, { recursive: true });

        const boilerplateNode = `import React from "react";

export default function ${name.replace(/[^a-zA-Z0-9]/g, '') || "NewPage"}() {
  return (
    <main className="min-h-screen bg-white text-slate-800 p-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Welcome to ${name}</h1>
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
            name,
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
                name: name,
                desc: 'Newly created page',
                path: `/${slug}`
            }
        });

    } catch (error) {
        console.error("Create Page Error:", error);
        return NextResponse.json({ error: "Failed to create new page" }, { status: 500 });
    }
}
