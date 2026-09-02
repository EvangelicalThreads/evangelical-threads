import type { Metadata } from 'next';
import Link from 'next/link';

// Next.js renders this automatically for any unmatched route — no wiring
// needed beyond the file existing here. Server component, so it can carry
// its own metadata (and it's excluded from the sitemap/robots crawl
// targets on purpose — nothing to index on a 404).
export const metadata: Metadata = {
  title: 'Page Not Found',
};

export default function NotFound() {
  return (
    <main className="bg-[#F2F0EB] min-h-screen text-[#14161a] flex items-center">
      <div className="max-w-[480px] mx-auto px-6 py-24 text-center">
        <p className="text-[10px] uppercase tracking-[0.24em] text-[#14161a]/40 mb-6">404</p>
        <p className="rv-serif italic text-[32px] md:text-[38px] leading-[1.15] text-[#14161a] mb-6">
          This page has drifted off course.
        </p>
        <p className="text-[13px] leading-[1.8] text-[#14161a]/55 mb-12">
          {"The page you're looking for doesn't exist, or has moved. Let's get you back to open water."}
        </p>
        <div className="flex items-center justify-center gap-8">
          <Link
            href="/"
            className="text-[11px] uppercase tracking-[0.2em] text-[#14161a] border-b border-[#14161a]/30 pb-1 hover:border-[#14161a] transition"
          >
            Home
          </Link>
          <Link
            href="/shop"
            className="text-[11px] uppercase tracking-[0.2em] text-[#14161a] border-b border-[#14161a]/30 pb-1 hover:border-[#14161a] transition"
          >
            Shop
          </Link>
        </div>
      </div>
    </main>
  );
}
