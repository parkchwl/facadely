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

  // If /en is used, redirect to path without /en
  if (pathname.startsWith('/en/') || pathname === '/en') {
    return 'redirect-to-default';
  }

  // Default to English for all other paths
  return i18n.defaultLocale;
}

export async function middleware(request: NextRequest) {
  const locale = getLocale(request);

  // Redirect /en/* to /* (remove /en prefix for default locale)
  if (locale === 'redirect-to-default') {
    const newPath = request.nextUrl.pathname.replace(/^\/en\/?/, '/') || '/';
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard'];

  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
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
