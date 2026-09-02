import crypto from 'crypto';
import { META_PIXEL_ID } from './metaPixel';

const CAPI_VERSION = 'v21.0';

// Meta requires personal identifiers (email, phone, etc.) to be hashed
// before they're sent — never the raw value. Trim + lowercase first,
// per Meta's own spec, so "Jane@Example.com " and "jane@example.com"
// hash identically.
function hashForMeta(value: string) {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

interface PurchaseEventInput {
  eventId: string;
  email?: string | null;
  value: number;
  currency?: string;
  contentIds?: string[];
  eventSourceUrl?: string;
}

// Server-side half of purchase tracking (Meta Conversions API) — sent
// straight from the Stripe webhook so the conversion is recorded even
// when a customer's browser blocks the client-side Pixel from firing on
// the success page (ad blockers, Safari ITP, etc.). `eventId` must match
// the `eventId` passed to the client-side `trackPixelEvent('Purchase',
// ...)` call (see success/page.tsx) so Meta dedupes the two into one
// conversion rather than counting the sale twice.
export async function sendMetaPurchaseEvent(input: PurchaseEventInput) {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!accessToken) {
    console.warn('META_CAPI_ACCESS_TOKEN not set — skipping Conversions API purchase event');
    return;
  }

  const userData: Record<string, unknown> = {};
  if (input.email) userData.em = [hashForMeta(input.email)];

  const payload = {
    data: [
      {
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: 'website',
        event_source_url:
          input.eventSourceUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ryvol.shop',
        user_data: userData,
        custom_data: {
          currency: input.currency || 'USD',
          value: input.value,
          ...(input.contentIds && input.contentIds.length
            ? { content_ids: input.contentIds, content_type: 'product' }
            : {}),
        },
      },
    ],
  };

  const res = await fetch(
    `https://graph.facebook.com/${CAPI_VERSION}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(accessToken)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Meta Conversions API request failed (${res.status}): ${text}`);
  }
}
