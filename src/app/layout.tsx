'use client';

import './globals.css';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { CartProvider } from '../context/CartContext';
import React, { useState, useEffect } from 'react';

interface RootLayoutProps {
  children: React.ReactNode;
  session?: Session | null;
}

export default function RootLayout({ children, session }: RootLayoutProps) {
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookieAccepted');
    if (!accepted) setShowCookieBanner(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieAccepted', 'true');
    setShowCookieBanner(false);
  };

  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-hidden bg-[#F2F0EB] text-[#14161a]">
        <SessionProvider session={session}>
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
              <a href="/privacy" className="underline underline-offset-2 hover:text-[#A1543E]">
                Privacy Policy
              </a>
            </span>
            <button
              onClick={acceptCookies}
              className="ml-4 shrink-0 bg-[#14161a] text-[#F2F0EB] px-5 py-2 text-[10px] uppercase tracking-[0.28em] hover:bg-[#A1543E] transition"
            >
              Accept
            </button>
          </div>
        )}
      </body>
    </html>
  );
}
