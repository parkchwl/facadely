import { NextRequest, NextResponse } from 'next/server';
import { i18n } from '@/i18n/config';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1').replace(/\/$/, '');

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

  const protectedRoutes = ['/dashboard'];

  const isProtectedRoute = protectedRoutes.some(route =>
    pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(`${route}/`)
  );

  if (isProtectedRoute) {
    const authenticated = await isAuthenticated(request);
    if (!authenticated) {
      const url = request.nextUrl.clone();
      url.pathname = localeFromPath && localeFromPath !== i18n.defaultLocale
        ? `/${localeFromPath}/login`
        : '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)',
  ],
};
