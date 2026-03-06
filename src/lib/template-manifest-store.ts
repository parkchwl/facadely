import fs from "fs/promises";
import path from "path";
import { parseTemplateManifest, TemplateManifest } from "@/lib/template-manifest-types";
import {
  getDefaultLegacyTemplatePath,
  getTemplateByLegacyPath,
  toLegacyTemplatePath,
} from "@/lib/template-registry";

const APP_DIR = path.join(process.cwd(), "src", "app");
const STATIC_TEMPLATE_DIR = path.join(process.cwd(), "templates");
const SAFE_SITE_PATH = /^\/[a-z0-9/-]*$/;

function normalizeSitePath(sitePath: string): string {
  if (!sitePath) return getDefaultLegacyTemplatePath();
  const withLeadingSlash = sitePath.startsWith("/") ? sitePath : `/${sitePath}`;
  const normalized = withLeadingSlash.replace(/\/+/g, "/");
  const normalizedWithoutTrailingSlash =
    normalized.length > 1 && normalized.endsWith("/")
      ? normalized.slice(0, -1)
      : normalized;
  return toLegacyTemplatePath(normalizedWithoutTrailingSlash);
}

function assertSafeSitePath(sitePath: string): string {
  const normalized = normalizeSitePath(sitePath);
  if (!SAFE_SITE_PATH.test(normalized) || normalized.includes("..")) {
    throw new Error("Invalid site path");
  }
  return normalized;
}

function sitePathToSegments(sitePath: string): string[] {
  return sitePath
    .replace(/^\/+/, "")
    .split("/")
    .filter(Boolean);
}

function manifestCandidates(sitePath: string): string[] {
  const normalized = assertSafeSitePath(sitePath);
  const segments = sitePathToSegments(normalized);
  if (segments.length === 0) return [];

  const candidates: string[] = [];
  const registryEntry = getTemplateByLegacyPath(normalized);
  if (registryEntry) {
    candidates.push(path.join(APP_DIR, registryEntry.slug, "manifest.json"));
  }
  candidates.push(path.join(APP_DIR, ...segments, "manifest.json"));

  if (segments[0] === "t" && segments.length >= 2) {
    candidates.push(path.join(STATIC_TEMPLATE_DIR, ...segments.slice(1), "manifest.json"));
  } else {
    candidates.push(path.join(STATIC_TEMPLATE_DIR, ...segments, "manifest.json"));
  }

  return Array.from(new Set(candidates));
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readManifestFile(filePath: string, expectedSitePath: string): Promise<TemplateManifest | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    const manifest = parseTemplateManifest(parsed);

    if (manifest.sitePath !== expectedSitePath) {
      throw new Error(
        `Template manifest sitePath mismatch for ${filePath}: expected ${expectedSitePath}, got ${manifest.sitePath}`
      );
    }

    return manifest;
  } catch {
    return null;
  }
}

export async function readTemplateManifest(sitePath: string): Promise<TemplateManifest | null> {
  const safeSitePath = assertSafeSitePath(sitePath);
  const candidates = manifestCandidates(safeSitePath);

  for (const candidate of candidates) {
    const manifest = await readManifestFile(candidate, safeSitePath);
    if (manifest) return manifest;
  }

  return null;
}

async function readManifestWithoutExpectedPath(filePath: string): Promise<TemplateManifest | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return parseTemplateManifest(JSON.parse(raw));
  } catch {
    return null;
  }
}

export async function listTemplateManifests(): Promise<TemplateManifest[]> {
  const manifests = new Map<string, TemplateManifest>();

  try {
    const appEntries = await fs.readdir(APP_DIR, { withFileTypes: true });
    for (const entry of appEntries) {
      if (
        !entry.isDirectory() ||
        entry.name.startsWith("api") ||
        entry.name.startsWith(".") ||
        entry.name.startsWith("p") ||
        entry.name.includes("[")
      ) {
        continue;
      }

      const routeDir = path.join(APP_DIR, entry.name);
      const pagePath = path.join(routeDir, "page.tsx");
      const templateViewPath = path.join(routeDir, "TemplateView.tsx");
      const manifestPath = path.join(routeDir, "manifest.json");
      const hasPageRuntime = await fileExists(pagePath);
      const hasTemplateRuntime = await fileExists(templateViewPath);
      if (!hasPageRuntime && !hasTemplateRuntime) {
        continue;
      }

      const manifest = await readManifestWithoutExpectedPath(manifestPath);
      if (!manifest) continue;
      manifests.set(manifest.sitePath, manifest);
    }
  } catch {
    // Ignore missing app templates.
  }

  try {
    const staticEntries = await fs.readdir(STATIC_TEMPLATE_DIR, { withFileTypes: true });
    for (const entry of staticEntries) {
      if (!entry.isDirectory() || entry.name.startsWith(".")) {
        continue;
      }
      const manifestPath = path.join(STATIC_TEMPLATE_DIR, entry.name, "manifest.json");
      const indexPath = path.join(STATIC_TEMPLATE_DIR, entry.name, "index.html");
      try {
        await fs.access(indexPath);
      } catch {
        continue;
      }
      const manifest = await readManifestWithoutExpectedPath(manifestPath);
      if (!manifest) continue;
      manifests.set(manifest.sitePath, manifest);
    }
  } catch {
    // Ignore missing static templates.
  }

  return Array.from(manifests.values()).sort((a, b) => a.sitePath.localeCompare(b.sitePath));
}
