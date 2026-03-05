import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { readTemplateManifest } from "@/lib/template-manifest-store";
import { upsertCustomFont } from "@/lib/site-customization-store";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "fonts");
const SAFE_SITE_PATH = /^\/[a-z0-9/-]*$/;
const SAFE_FONT_FAMILY = /^[a-z0-9 _-]{2,64}$/i;

function sanitizeFontFamily(input: string): string {
  const trimmed = input.trim().replace(/\s+/g, " ");
  if (!SAFE_FONT_FAMILY.test(trimmed)) {
    throw new Error("Invalid font family name");
  }
  return trimmed;
}

function normalizeSitePath(input: string): string {
  const withSlash = input.startsWith("/") ? input : `/${input}`;
  const normalized = withSlash.replace(/\/+/g, "/");
  if (!SAFE_SITE_PATH.test(normalized) || normalized.includes("..")) {
    throw new Error("Invalid site path");
  }
  return normalized;
}

function safeFileName(baseName: string): string {
  const normalized = baseName
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return normalized || "custom-font";
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const sitePathRaw = form.get("sitePath");
    const familyRaw = form.get("family");
    const file = form.get("file");

    if (typeof sitePathRaw !== "string" || typeof familyRaw !== "string") {
      return NextResponse.json({ error: "sitePath and family are required" }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    const sitePath = normalizeSitePath(sitePathRaw);
    const family = sanitizeFontFamily(familyRaw);

    const manifest = await readTemplateManifest(sitePath);
    if (!manifest) {
      return NextResponse.json({ error: "Template manifest not found for sitePath" }, { status: 404 });
    }

    const lowerName = file.name.toLowerCase();
    const isWoff2ByName = lowerName.endsWith(".woff2");
    const isWoff2ByMime = (file.type || "").toLowerCase().includes("woff2");
    if (!isWoff2ByName && !isWoff2ByMime) {
      return NextResponse.json({ error: "Only .woff2 font files are supported" }, { status: 400 });
    }

    const sizeLimit = 3 * 1024 * 1024;
    if (file.size > sizeLimit) {
      return NextResponse.json({ error: "Font file is too large (max 3MB)" }, { status: 400 });
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const stamp = Date.now();
    const suffix = Math.random().toString(36).slice(2, 8);
    const outputFileName = `${safeFileName(family)}-${stamp}-${suffix}.woff2`;
    const outputPath = path.join(UPLOAD_DIR, outputFileName);

    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(outputPath, Buffer.from(arrayBuffer));

    const url = `/uploads/fonts/${outputFileName}`;
    await upsertCustomFont(sitePath, { family, url });

    return NextResponse.json({
      success: true,
      font: {
        family,
        url,
      },
    });
  } catch (error) {
    if (error instanceof Error && /Invalid/.test(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("font upload error:", error);
    return NextResponse.json({ error: "Failed to upload font" }, { status: 500 });
  }
}
