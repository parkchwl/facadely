import fs from "fs/promises";
import path from "path";

const STATIC_TEMPLATE_DIR = path.join(process.cwd(), "templates");
const SAFE_TEMPLATE_SLUG = /^[a-z0-9-]+$/;

function assertSafeSlug(slug: string): string {
  const normalized = slug.trim().toLowerCase();
  if (!SAFE_TEMPLATE_SLUG.test(normalized)) {
    throw new Error("Invalid template slug");
  }
  return normalized;
}

function templateRoot(slug: string): string {
  return path.join(STATIC_TEMPLATE_DIR, assertSafeSlug(slug));
}

function resolveTemplatePath(slug: string, relativePath: string): string {
  const root = templateRoot(slug);
  const normalizedRelative = relativePath.replace(/^\/+/, "");
  const fullPath = path.join(root, normalizedRelative);
  const relative = path.relative(root, fullPath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Invalid template asset path");
  }
  return fullPath;
}

export async function readStaticTemplateText(slug: string, relativePath: string): Promise<string> {
  const fullPath = resolveTemplatePath(slug, relativePath);
  return fs.readFile(fullPath, "utf8");
}

export async function readStaticTemplateBuffer(slug: string, relativePath: string): Promise<Buffer> {
  const fullPath = resolveTemplatePath(slug, relativePath);
  return fs.readFile(fullPath);
}

export function staticTemplateMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".js":
      return "application/javascript; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".woff":
      return "font/woff";
    case ".woff2":
      return "font/woff2";
    case ".ttf":
      return "font/ttf";
    default:
      return "application/octet-stream";
  }
}

export function staticTemplateSitePath(slug: string): string {
  return `/t/${assertSafeSlug(slug)}`;
}
