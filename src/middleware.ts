import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/config';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    if (pathname !== '/admin/login') {
      try {
        const session = await auth();
        if (!session?.user) {
          const loginUrl = new URL('/admin/login', req.url);
          loginUrl.searchParams.set('callbackUrl', pathname);
          return NextResponse.redirect(loginUrl);
        }
      } catch {
        const loginUrl = new URL('/admin/login', req.url);
        return NextResponse.redirect(loginUrl);
      }
    }
    return NextResponse.next();
  }

  // All other routes: handle i18n
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/admin/:path*', '/((?!admin|api|_next|_vercel|.*\\..*).*)'],
};
