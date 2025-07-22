'use client';

import './globals.css';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import ScrollPopup from '../components/ScrollPopup';
import { CartProvider } from '../context/CartContext';
import React, { useState } from 'react';

interface RootLayoutProps {
  children: React.ReactNode;
  session?: Session | null;
}

export default function RootLayout({ children, session }: RootLayoutProps) {
  const [scrollVisible, setScrollVisible] = useState(false);

  const handleScrollClose = () => {
    setScrollVisible(false);
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
      </body>
    </html>
  );
}
