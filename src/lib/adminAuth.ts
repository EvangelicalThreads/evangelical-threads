// Lightweight shared-password gate for /admin and /api/admin — not a full
// multi-user auth system (there's no isAdmin/role field on User), just a
// single password only you know, checked against a signed cookie. Uses
// Web Crypto (crypto.subtle) rather than Node's `crypto` module because
// middleware runs on the Edge runtime by default, where Node's crypto
// isn't available.

export const ADMIN_COOKIE_NAME = 'ryvol_admin';
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 14; // 2 weeks

function getSigningSecret(): string {
  // Reuses NEXTAUTH_SECRET rather than introducing a second secret to
  // manage — it's already required for the site's existing login/signup
  // flow, so it's guaranteed to be set in production.
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET is not set — required for admin auth.');
  }
  return secret;
}

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hmac(message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getSigningSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return bufToHex(signature);
}

// Constant-time-ish comparison — avoids leaking how many leading
// characters matched via response-timing differences.
function timingSafeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let mismatch = a.length === b.length ? 0 : 1;
  for (let i = 0; i < len; i++) {
    mismatch |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return mismatch === 0;
}

// The cookie value is a fixed HMAC of a constant string under the site's
// secret — anyone who's entered the correct ADMIN_PASSWORD once gets the
// same token, but nobody can produce it without the secret. That's fine
// for a single shared admin credential; it wouldn't be for per-user auth.
export async function createAdminToken(): Promise<string> {
  return hmac('ryvol-admin-session');
}

export async function isValidAdminToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const expected = await createAdminToken();
  return timingSafeEqual(token, expected);
}

export function checkAdminPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return timingSafeEqual(String(candidate || ''), expected);
}
