'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import PromoBanner from './PromoBanner';
import Analytics from './Analytics';
import MetaPixel from './MetaPixel';
import { CartProvider } from '../context/CartContext';
import React, { useState, useEffect } from 'react';

// Everything that actually needs the browser — session state, cart state,
// the cookie banner — lives here so the real layout.tsx can stay a server
// component and export `metadata` (title/description/OG tags), which
// Next.js only allows in server components. `session` was never actually
// getting passed down from anywhere (App Router layouts don't receive
// custom props), so SessionProvider falling back to its own client-side
// fetch here is identical behavior to before, not a regression.
export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookieAccepted');
    if (!accepted) setShowCookieBanner(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieAccepted', 'true');
    setShowCookieBanner(false);
    // Lets Analytics (mounted below, already past its own initial check)
    // start tracking immediately instead of waiting for a page reload.
    window.dispatchEvent(new Event('cookie-consent-accepted'));
  };

  return (
    <>
      <Analytics />
      <MetaPixel />
      <PromoBanner />
      <SessionProvider>
        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>
      </SessionProvider>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#14161a',
            color: '#F2F0EB',
            borderRadius: '0',
            fontSize: '13px',
            letterSpacing: '0.05em',
          },
        }}
      />

      {showCookieBanner && (
        <div className="fixed bottom-0 w-full bg-[#F2F0EB] border-t border-[#14161a]/15 text-[#14161a] text-xs px-5 py-4 flex justify-between items-center z-50">
          <span className="tracking-[0.02em]">
            We use essential cookies to keep your cart and login sessions active.{' '}
            <a href="/privacy" className="underline underline-offset-2 hover:text-[var(--rv-navy)]">
              Privacy Policy
            </a>
          </span>
          <button
            onClick={acceptCookies}
            className="ml-4 shrink-0 bg-[#14161a] text-[#F2F0EB] px-5 py-2 text-[10px] uppercase tracking-[0.28em] hover:bg-[var(--rv-navy)] transition"
          >
            Accept
          </button>
        </div>
      )}
    </>
  );
}
