import { NextRequest, NextResponse } from 'next/server';
import { i18n } from '@/i18n/config';
import { createLoginPathWithNext } from '@/lib/auth-redirect';

const API_BASE_URL = (
  process.env.INTERNAL_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://localhost:8080/api/v1'
).replace(/\/$/, '');

const ACCESS_COOKIE_NAME = process.env.COOKIE_ACCESS_NAME || 'facadely_at';
const REFRESH_COOKIE_NAME = process.env.COOKIE_REFRESH_NAME || 'facadely_rt';

function hasCookie(request: NextRequest, cookieName: string): boolean {
  return request.cookies.has(cookieName);
}

function hasAuthCookie(request: NextRequest): boolean {
  return hasCookie(request, ACCESS_COOKIE_NAME) || hasCookie(request, REFRESH_COOKIE_NAME);
}

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
      cache: 'no-store',
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const passthroughRoutes = ['/editor', '/5', '/6', '/7', '/s', '/t', '/p'];
  const isPassthroughRoute = passthroughRoutes.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  );
  const localizedRootRoutes = new Set([
    'about',
    'blog',
    'contact',
    'cookie',
    'customer-service',
    'dashboard',
    'generate',
    'login',
    'pricing',
    'privacy',
    'qa',
    'service',
    'status',
    'templates',
    'terms',
  ]);
  const firstSegment = pathname.split('/').filter(Boolean)[0] ?? '';
  const shouldRewriteToLocaleRoute = localizedRootRoutes.has(firstSegment);
  const localeFromPath = i18n.locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  const pathnameWithoutLocale = localeFromPath
    ? pathname.replace(new RegExp(`^/${localeFromPath}(?=/|$)`), '') || '/'
    : pathname;

  const isLocaleRoute = i18n.locales.some(
    locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (
    !isLocaleRoute &&
    !isPassthroughRoute &&
    shouldRewriteToLocaleRoute &&
    pathname !== '/' &&
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/api')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/en${pathname}`;
    return NextResponse.rewrite(url);
  }

  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/en';
    return NextResponse.rewrite(url);
  }

  const protectedRoutes = ['/dashboard', '/editor', '/generate'];

  const isProtectedRoute = protectedRoutes.some(route =>
    pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(`${route}/`)
  );

  if (isProtectedRoute) {
    const locale = localeFromPath && i18n.locales.includes(localeFromPath) ? localeFromPath : i18n.defaultLocale;
    const loginRedirectPath = createLoginPathWithNext(locale, `${pathname}${request.nextUrl.search}`);

    if (!hasAuthCookie(request)) {
      return NextResponse.redirect(new URL(loginRedirectPath, request.url));
    }

    const isDashboardRoute = pathnameWithoutLocale === '/dashboard' || pathnameWithoutLocale.startsWith('/dashboard/');
    if (!isDashboardRoute) {
      const authenticated = await isAuthenticated(request);
      if (!authenticated) {
        return NextResponse.redirect(new URL(loginRedirectPath, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)',
  ],
};
