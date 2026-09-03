import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_MAX_AGE, checkAdminPassword, createAdminToken } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const password = typeof body.password === 'string' ? body.password : '';

  if (!process.env.ADMIN_PASSWORD) {
    // Fails safe: with no password configured, nobody gets in rather than
    // everybody getting in.
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD is not set on the server.' },
      { status: 500 }
    );
  }

  if (!checkAdminPassword(password)) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const token = await createAdminToken();
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
  return res;
}
