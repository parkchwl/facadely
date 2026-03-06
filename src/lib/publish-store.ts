import fs from "fs/promises";
import path from "path";
import {
  getDefaultCanonicalTemplatePath,
  toCanonicalTemplatePath,
} from "@/lib/template-registry";

export type PublishRecord = {
  sitePath: string;
  publishedSlug: string;
  customDomain?: string;
  status: "published";
  publishedAt: string;
  updatedAt: string;
};

const DATA_DIR = path.join(process.cwd(), ".runtime", "publish");
const DATA_FILE = path.join(DATA_DIR, "records.json");
const SAFE_SITE_PATH = /^\/[a-z0-9/-]*$/;
const DOMAIN_REGEX = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

function normalizeSitePath(sitePath: string): string {
  if (!sitePath) return getDefaultCanonicalTemplatePath();
  const withLeadingSlash = sitePath.startsWith("/") ? sitePath : `/${sitePath}`;
  const normalized = withLeadingSlash.replace(/\/+/g, "/");
  const normalizedWithoutTrailingSlash =
    normalized.length > 1 && normalized.endsWith("/")
      ? normalized.slice(0, -1)
      : normalized;
  return toCanonicalTemplatePath(normalizedWithoutTrailingSlash);
}

function assertSafeSitePath(sitePath: string): string {
  const normalized = normalizeSitePath(sitePath);
  if (!SAFE_SITE_PATH.test(normalized) || normalized.includes("..")) {
    throw new Error("Invalid site path");
  }
  return normalized;
}

function matchesSitePath(recordSitePath: string, expectedSitePath: string): boolean {
  try {
    return assertSafeSitePath(recordSitePath) === expectedSitePath;
  } catch {
    return false;
  }
}

function toPublishedSlug(sitePath: string): string {
  if (sitePath === "/") return "root";
  return sitePath
    .slice(1)
    .replace(/\//g, "-")
    .replace(/[^a-z0-9-]/gi, "")
    .toLowerCase();
}

async function ensureStore(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readAll(): Promise<PublishRecord[]> {
  await ensureStore();
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PublishRecord[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(records: PublishRecord[]): Promise<void> {
  await ensureStore();
  await fs.writeFile(DATA_FILE, `${JSON.stringify(records, null, 2)}\n`, "utf8");
}

export async function getPublishRecord(sitePath: string): Promise<PublishRecord | null> {
  const safePath = assertSafeSitePath(sitePath);
  const records = await readAll();
  return records.find((record) => matchesSitePath(record.sitePath, safePath)) ?? null;
}

export async function getPublishRecordBySlug(slug: string): Promise<PublishRecord | null> {
  const records = await readAll();
  return records.find((record) => record.publishedSlug === slug) ?? null;
}

export async function publishSite(sitePath: string, customDomain?: string): Promise<PublishRecord> {
  const safePath = assertSafeSitePath(sitePath);
  const normalizedDomain = customDomain?.trim().toLowerCase() || undefined;
  if (normalizedDomain && !DOMAIN_REGEX.test(normalizedDomain)) {
    throw new Error("Invalid custom domain format");
  }

  const records = await readAll();
  const now = new Date().toISOString();
  const publishedSlug = toPublishedSlug(safePath);

  const nextRecord: PublishRecord = {
    sitePath: safePath,
    publishedSlug,
    customDomain: normalizedDomain,
    status: "published",
    publishedAt: now,
    updatedAt: now,
  };

  const existingIndex = records.findIndex((record) => record.sitePath === safePath);
  if (existingIndex >= 0) {
    const existing = records[existingIndex];
    records[existingIndex] = {
      ...existing,
      ...nextRecord,
      publishedAt: existing.publishedAt || now,
      updatedAt: now,
    };
  } else {
    const legacyIndex = records.findIndex((record) => matchesSitePath(record.sitePath, safePath));
    if (legacyIndex >= 0) {
      const existing = records[legacyIndex];
      records[legacyIndex] = {
        ...existing,
        ...nextRecord,
        publishedAt: existing.publishedAt || now,
        updatedAt: now,
      };
      await writeAll(records);
      return records[legacyIndex];
    }
    records.push(nextRecord);
  }

  await writeAll(records);
  return records.find((record) => record.sitePath === safePath)!;
}
