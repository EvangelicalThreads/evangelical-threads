'use client';

import './globals.css';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import ScrollPopup from '../components/ScrollPopup';
import { CartProvider } from '../context/CartContext';
import React, { useState, useEffect } from 'react';

interface RootLayoutProps {
  children: React.ReactNode;
  session?: Session | null;
}

export default function RootLayout({ children, session }: RootLayoutProps) {
  const [scrollVisible, setScrollVisible] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookieAccepted');
    if (!accepted) setShowCookieBanner(true);
  }, []);

  const handleScrollClose = () => {
    setScrollVisible(false);
  };

  const acceptCookies = () => {
    localStorage.setItem('cookieAccepted', 'true');
    setShowCookieBanner(false);
  };

  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-hidden">
        <SessionProvider session={session}>
          <CartProvider>
            <Navbar />
            <ScrollPopup
              isVisible={scrollVisible}
              onClose={handleScrollClose}
              verseText="You are the light of the world."
            />
            {children}
          </CartProvider>
        </SessionProvider>

        <Toaster position="top-center" />

        {showCookieBanner && (
          <div className="fixed bottom-0 w-full bg-white border-4 border-[#D4AF37] text-[#D4AF37] text-sm px-4 py-3 flex justify-between items-center z-50 shadow-md rounded-t-md">
            <span>
              We use essential cookies to keep your cart and login sessions active and
              improve your experience.{' '}
              <a href="/privacy" className="underline text-[#D4AF37] hover:text-[#bfa236]">
                Privacy Policy
              </a>
            </span>
            <button
              onClick={acceptCookies}
              className="ml-4 border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-white text-[#D4AF37] px-3 py-1 rounded font-semibold transition"
            >
              Accept
            </button>
          </div>
        )}
      </body>
    </html>
  );
}
