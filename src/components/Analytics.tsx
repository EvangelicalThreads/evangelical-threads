'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

// Public GA4 Measurement ID — not a secret, it's embedded in every page's
// HTML by design (that's how the browser knows where to send hits), so
// hardcoding it here matches how the rest of this codebase handles
// non-secret public constants (see ADMIN_EMAIL in lib/resend.ts).
const GA_MEASUREMENT_ID = 'G-2FR3VKY7NW';

// Only loads Google Analytics once the cookie banner has actually been
// accepted — matches the promise already made on /privacy ("optional
// analytics... but only if you opt in"). Before this component existed,
// that promise wasn't backed by anything since no analytics existed at
// all yet.
export default function Analytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    // Already accepted on a previous visit.
    if (localStorage.getItem('cookieAccepted') === 'true') {
      setConsented(true);
    }

    // Accepted just now, in this session — the cookie banner fires this
    // the moment someone clicks Accept, so analytics starts immediately
    // rather than waiting for a page reload.
    const onAccept = () => setConsented(true);
    window.addEventListener('cookie-consent-accepted', onAccept);
    return () => window.removeEventListener('cookie-consent-accepted', onAccept);
  }, []);

  if (!consented) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
