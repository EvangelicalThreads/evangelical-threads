'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { META_PIXEL_ID, trackPixelEvent } from '@/lib/metaPixel';

// Same cookie-consent gating as Analytics.tsx — only loads once the
// banner has been accepted, and starts immediately (no reload needed)
// when 'cookie-consent-accepted' fires.
export default function MetaPixel() {
  const [consented, setConsented] = useState(false);
  const pathname = usePathname();
  // The inline init script below already fires the first PageView itself
  // (synchronously, in the same script execution that defines window.fbq)
  // — this ref just stops the effect from firing a duplicate PageView for
  // that same initial load. Real route changes still track normally.
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (localStorage.getItem('cookieAccepted') === 'true') {
      setConsented(true);
    }
    const onAccept = () => setConsented(true);
    window.addEventListener('cookie-consent-accepted', onAccept);
    return () => window.removeEventListener('cookie-consent-accepted', onAccept);
  }, []);

  // fbevents.js only auto-fires PageView on the very first script load —
  // App Router navigations never reload the page, so route changes need
  // an explicit re-fire per path.
  useEffect(() => {
    if (!consented) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    trackPixelEvent('PageView');
  }, [pathname, consented]);

  if (!consented) return null;

  return (
    <>
      <Script id="meta-pixel-init" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
