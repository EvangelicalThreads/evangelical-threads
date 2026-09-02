// Shared between the client-side Meta Pixel (MetaPixel.tsx) and the
// server-side Conversions API (metaCapi.ts) so both report events under
// the same dataset. Not a secret — this ID is embedded in every page's
// HTML by design (that's how the browser knows where to send events),
// same reasoning as GA_MEASUREMENT_ID in Analytics.tsx.
export const META_PIXEL_ID = '899321856255531';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// Fires a Meta Pixel event from the browser. Silently no-ops if the
// pixel hasn't loaded yet (cookie consent not accepted, or the script
// is still loading) — these are supplementary marketing signals, never
// something a page action should be blocked on.
//
// Pass `eventId` for any event that's also sent server-side via the
// Conversions API (currently just Purchase) so Meta dedupes the browser
// and server copies into a single conversion instead of double-counting.
export function trackPixelEvent(
  eventName: string,
  params?: Record<string, unknown>,
  eventId?: string
) {
  if (typeof window === 'undefined' || !window.fbq) return;
  if (eventId) {
    window.fbq('track', eventName, params || {}, { eventID: eventId });
  } else {
    window.fbq('track', eventName, params || {});
  }
}
