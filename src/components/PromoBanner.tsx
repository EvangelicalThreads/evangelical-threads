'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const DISMISS_KEY = 'ryvol_promo_banner_dismissed';

/** Slim, non-overlaying announcement strip for the newsletter's 10% off
 *  offer. Lives in normal document flow above the (sticky) Navbar, so it
 *  never covers page content — it just scrolls out of view once you scroll
 *  past it, same as the nav itself would if it weren't sticky. Dismissal
 *  is remembered per-browser via localStorage, same pattern as the cookie
 *  banner in RootLayoutClient. */
export default function PromoBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;
    setVisible(true);
    // Delay a tick so the height/opacity transition actually plays instead
    // of the strip rendering already-expanded on first paint.
    const t = window.setTimeout(() => setOpen(true), 50);
    return () => window.clearTimeout(t);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, 'true');
    setOpen(false);
    window.setTimeout(() => setVisible(false), 200);
  };

  // Keep it out of the admin dashboard — that's Hayden's own tool, not a
  // customer-facing page.
  if (pathname?.startsWith('/admin') || !visible) return null;

  return (
    <div
      className={`w-full bg-[#14161a] text-[#F2F0EB] overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
        open ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 h-9 flex items-center justify-center relative">
        <Link
          href="/#notify"
          className="text-[10px] uppercase tracking-[0.2em] text-[#F2F0EB]/90 hover:text-[#F2F0EB] transition"
        >
          Sign up for 10% off your first order
        </Link>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute right-3 text-[#F2F0EB]/50 hover:text-[#F2F0EB] text-sm leading-none transition"
        >
          ×
        </button>
      </div>
    </div>
  );
}
