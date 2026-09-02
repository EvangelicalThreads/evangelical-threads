'use client';

import Link from 'next/link';

const LINKS = [
  { href: '/admin/orders', label: 'Orders', desc: 'View and ship incoming orders' },
  { href: '/admin/reviews', label: 'Reviews', desc: 'Manage published reviews' },
  { href: '/admin/reflections', label: 'Reflections', desc: 'Review reflections' },
];

export default function AdminPage() {
  return (
    <main className="bg-[#F2F0EB] min-h-screen text-[#14161a]">
      <div className="max-w-[520px] mx-auto px-6 pt-24 pb-28 md:pt-32 text-center">
        <p className="rv-serif italic text-[32px] md:text-[38px] leading-[1.1] text-[#14161a] mb-16">
          Admin
        </p>

        <ul className="divide-y divide-[#14161a]/10 text-left">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex items-center justify-between gap-4 py-6 hover:opacity-70 transition"
              >
                <div>
                  <p className="rv-serif italic text-[19px] text-[#14161a]">{link.label}</p>
                  <p className="mt-0.5 text-[11px] text-[#14161a]/45">{link.desc}</p>
                </div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#14161a]/40 border-b border-[#14161a]/20 pb-0.5 group-hover:border-[#14161a] group-hover:text-[#14161a] transition shrink-0">
                  Open
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
