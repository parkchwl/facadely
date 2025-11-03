import { NextRequest, NextResponse } from 'next/server';
import { i18n } from '@/i18n/config';
import { updateSession } from '@/lib/supabase/middleware';

function getLocale(request: NextRequest): string {
  const pathname = request.nextUrl.pathname;

  // Check if pathname starts with any non-default locale
  for (const locale of i18n.locales) {
    if (locale === i18n.defaultLocale) continue; // Skip default locale (en)
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return locale;
    }
  }

  // Default to English for all other paths
  return i18n.defaultLocale;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Rewrite root paths to /en internally (no redirect - invisible to user)
  // This allows "/" to work while serving from "/en" route
  const isLocaleRoute = i18n.locales.some(
    locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (!isLocaleRoute && pathname !== '/' && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
    // This is a root path that should be rewritten to /en
    const url = request.nextUrl.clone();
    url.pathname = `/en${pathname}`;
    return NextResponse.rewrite(url);
  }

  if (pathname === '/') {
    // Rewrite "/" to "/en" internally
    const url = request.nextUrl.clone();
    url.pathname = '/en';
    return NextResponse.rewrite(url);
  }

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard'];

  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // If it's a protected route, check authentication
  if (isProtectedRoute) {
    return await updateSession(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (images and static assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)',
  ],
};
