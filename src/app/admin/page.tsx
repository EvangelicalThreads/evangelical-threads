'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const LINKS = [
  { href: '/admin/orders', label: 'Orders', desc: 'View and ship incoming orders' },
  { href: '/admin/reviews', label: 'Reviews', desc: 'Manage published reviews' },
  { href: '/admin/reflections', label: 'Reflections', desc: 'Review reflections' },
];

// External tools you actually use to run the business — not embeddable
// (Stripe, Google, GitHub all block being loaded inside someone else's
// site for security reasons), so this is a fast jump-off point instead.
// Swap in your own workspace/property URLs below if these generic ones
// don't land you straight on the right account.
const EXTERNAL_LINKS = [
  { href: 'https://dashboard.stripe.com', label: 'Stripe', desc: 'Payments, payouts, webhook logs' },
  { href: 'https://analytics.google.com', label: 'Analytics', desc: 'Traffic, sessions, conversions' },
  { href: 'https://search.google.com/search-console', label: 'Search Console', desc: 'How you show up on Google' },
  { href: 'https://resend.com/emails', label: 'Resend', desc: 'Every email the site has sent' },
  { href: 'https://github.com/EvangelicalThreads/evangelical-threads', label: 'GitHub', desc: 'Source code + push history' },
];

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  totalRevenueCents: number;
  pendingReviews: number;
}

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  return (
    <main className="bg-[#F2F0EB] min-h-screen text-[#14161a]">
      <div className="max-w-[560px] mx-auto px-6 pt-24 pb-28 md:pt-32">
        <p className="rv-serif italic text-center text-[32px] md:text-[38px] leading-[1.1] text-[#14161a] mb-16">
          Admin
        </p>

        {stats && (
          <div className="grid grid-cols-3 gap-px bg-[#14161a]/10 mb-16 border border-[#14161a]/10">
            <div className="bg-[#F2F0EB] px-3 py-5 text-center">
              <p className="rv-serif italic text-[22px] text-[#14161a]">{money(stats.totalRevenueCents)}</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#14161a]/45">Revenue</p>
            </div>
            <div className="bg-[#F2F0EB] px-3 py-5 text-center">
              <p className="rv-serif italic text-[22px] text-[#14161a]">{stats.paidOrders}</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#14161a]/45">Paid Orders</p>
            </div>
            <div className="bg-[#F2F0EB] px-3 py-5 text-center">
              <p className="rv-serif italic text-[22px] text-[#14161a]">{stats.pendingOrders}</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#14161a]/45">Pending</p>
            </div>
          </div>
        )}

        <p className="text-[10px] uppercase tracking-[0.24em] text-[#14161a]/40 mb-2">Your Store</p>
        <ul className="divide-y divide-[#14161a]/10 text-left mb-16">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex items-center justify-between gap-4 py-6 hover:opacity-70 transition"
              >
                <div>
                  <p className="rv-serif italic text-[19px] text-[#14161a]">
                    {link.label}
                    {link.href === '/admin/reviews' && stats && stats.pendingReviews > 0 && (
                      <span className="ml-2 align-middle text-[9px] uppercase tracking-[0.16em] text-[#14161a]/50 not-italic font-sans">
                        {stats.pendingReviews} new
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#14161a]/45">{link.desc}</p>
                </div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#14161a]/40 border-b border-[#14161a]/20 pb-0.5 group-hover:border-[#14161a] group-hover:text-[#14161a] transition shrink-0">
                  Open
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="text-[10px] uppercase tracking-[0.24em] text-[#14161a]/40 mb-2">External Tools</p>
        <ul className="divide-y divide-[#14161a]/10 text-left">
          {EXTERNAL_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 py-6 hover:opacity-70 transition"
              >
                <div>
                  <p className="rv-serif italic text-[19px] text-[#14161a]">{link.label}</p>
                  <p className="mt-0.5 text-[11px] text-[#14161a]/45">{link.desc}</p>
                </div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#14161a]/40 border-b border-[#14161a]/20 pb-0.5 group-hover:border-[#14161a] group-hover:text-[#14161a] transition shrink-0">
                  Open ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
