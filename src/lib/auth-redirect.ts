import { i18n } from '@/i18n/config';

const MAX_NEXT_PATH_LENGTH = 1024;

export function createLocalizedPath(locale: string, path: string): string {
  if (locale === i18n.defaultLocale) {
    return path;
  }
  return `/${locale}${path}`;
}

function isLoginPath(pathname: string): boolean {
  return /^\/(?:[a-zA-Z-]{2,10}\/)?login\/?$/.test(pathname);
}

export function sanitizeNextPath(rawNext: string | null | undefined): string | null {
  if (!rawNext) {
    return null;
  }

  const value = rawNext.trim();
  if (value.length === 0 || value.length > MAX_NEXT_PATH_LENGTH) {
    return null;
  }

  if (!value.startsWith('/') || value.startsWith('//')) {
    return null;
  }

  if (value.includes('\r') || value.includes('\n') || value.includes('\0')) {
    return null;
  }

  let parsed: URL;
  try {
    parsed = new URL(value, 'http://localhost');
  } catch {
    return null;
  }

  if (parsed.origin !== 'http://localhost') {
    return null;
  }

  if (
    parsed.pathname.startsWith('/api/') ||
    parsed.pathname.startsWith('/_next/') ||
    isLoginPath(parsed.pathname)
  ) {
    return null;
  }

  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}

export function resolvePostLoginPath(locale: string, rawNext: string | null | undefined): string {
  const safeNextPath = sanitizeNextPath(rawNext);
  if (safeNextPath) {
    return safeNextPath;
  }
  return createLocalizedPath(locale, '/dashboard');
}

export function createLoginPathWithNext(locale: string, nextPath: string): string {
  const loginPath = createLocalizedPath(locale, '/login');
  const safeNextPath = sanitizeNextPath(nextPath);
  if (!safeNextPath) {
    return loginPath;
  }
  return `${loginPath}?next=${encodeURIComponent(safeNextPath)}`;
}
