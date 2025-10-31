import { NextRequest, NextResponse } from 'next/server';
import { i18n } from '@/i18n/config';
import { updateSession } from '@/lib/supabase/middleware';

function getLocale(request: NextRequest): string | undefined {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    return i18n.defaultLocale;
  }
}

export async function middleware(request: NextRequest) {
  const locale = getLocale(request);
  if (locale) {
    return NextResponse.redirect(
      new URL(`/${locale}${request.nextUrl.pathname}`, request.url)
    );
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
