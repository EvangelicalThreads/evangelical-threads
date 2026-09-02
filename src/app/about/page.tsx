'use client';

import Link from 'next/link';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import Newsletter from '../../components/Newsletter';

// Coastal, restrained, old money — the brand doesn't explain itself, so this
// page doesn't either. Short sections, quiet typography, no hype copy.
// Matches the homepage's rv-serif / cream-ink-navy system.

export default function AboutPage() {
  return (
    <main className="bg-[#F2F0EB] text-[#14161a]">
      <div className="max-w-[640px] mx-auto px-6 pt-24 pb-20 md:pt-36 md:pb-28">

        {/* Header */}
        <div className="text-center mb-24 md:mb-28">
          <img
            src="/brand/ryvol-emblem-navy.png"
            alt="RYVOL"
            className="w-11 h-11 mx-auto mb-10"
          />
          <h1 className="rv-serif italic text-[38px] md:text-[52px] leading-[1.1] text-[#14161a] mb-4">
            Ryvol.
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#14161a]/40">
            Ref. 1376
          </p>
        </div>

        {/* The Name */}
        <section className="mb-20 md:mb-24">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#14161a]/40 mb-5">
            The Name
          </p>
          <p className="text-[16px] md:text-[18px] leading-[1.9] text-[#14161a]/75">
            RYVOL takes its shape from rival, and revolve. Not a rivalry with
            anyone else, only with who you were before.
          </p>
        </section>

        {/* The Coast */}
        <section className="mb-20 md:mb-24">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#14161a]/40 mb-5">
            The Coast
          </p>
          <p className="text-[16px] md:text-[18px] leading-[1.9] text-[#14161a]/75">
            Made along the Southern California coast, where mornings are slow
            and nothing is rushed. RYVOL is built for those hours: worn in,
            not worn out.
          </p>
        </section>

        {/* The Product */}
        <section className="mb-24 md:mb-28">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#14161a]/40 mb-5">
            The Product
          </p>
          <p className="text-[16px] md:text-[18px] leading-[1.9] text-[#14161a]/75">
            Heavyweight cotton and canvas, cut clean, kept for years. No loud
            logos, no explaining. The mark is small on purpose.
          </p>
        </section>

        {/* Mark */}
        <section className="border-y border-[#14161a]/10 py-16 md:py-20 mb-20 md:mb-24 text-center">
          <p className="rv-serif italic text-[24px] md:text-[28px] text-[#14161a]">
            Follow the Current.
          </p>
        </section>

        {/* FAQ */}
        <section className="text-center mb-20">
          <Link
            href="/faq"
            className="text-[11px] uppercase tracking-[0.22em] text-[#14161a]/60 border-b border-[#14161a]/25 pb-0.5 hover:text-[#14161a] hover:border-[#14161a] transition"
          >
            Questions
          </Link>
        </section>

        {/* CTA to Shop */}
        <section className="text-center mb-20">
          <Link
            href="/shop"
            className="text-[11px] uppercase tracking-[0.22em] text-[#14161a]/70 border-b border-[#14161a]/30 pb-0.5 hover:border-[#14161a] hover:text-[#14161a] transition"
          >
            Shop
          </Link>
        </section>

        <Newsletter />

        {/* Socials */}
        <div className="text-center mt-24 pb-4">
          <h3 className="text-[10px] uppercase tracking-[0.28em] text-[#14161a]/40 mb-5">
            Instagram — TikTok
          </h3>

          <div className="flex justify-center gap-6 text-[#14161a]/60 text-xl">
            <a
              href="https://www.instagram.com/ryvol.shop"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram className="hover:text-[#14161a] transition" />
            </a>

            <a
              href="https://www.tiktok.com/@ryvol.shop"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <FaTiktok className="hover:text-[#14161a] transition" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
