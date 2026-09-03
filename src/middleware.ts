import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, isValidAdminToken } from '@/lib/adminAuth';

// Gates every /admin page and /api/admin route behind the shared admin
// password (see src/lib/adminAuth.ts) — before this, both were reachable
// by anyone who knew or guessed the URL, with real customer orders,
// names, and addresses sitting behind them.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // The login page and its API, plus logout, have to stay reachable
  // without already being authenticated.
  const isExempt =
    pathname === '/admin/login' ||
    pathname === '/api/admin/login' ||
    pathname === '/api/admin/logout';

  if (isExempt) {
    return NextResponse.next();
  }

  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const authenticated = await isValidAdminToken(token);

  if (authenticated) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const loginUrl = new URL('/admin/login', req.url);
  loginUrl.searchParams.set('next', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
