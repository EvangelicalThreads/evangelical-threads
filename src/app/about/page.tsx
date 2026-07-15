'use client';

import Link from 'next/link';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import Newsletter from '../../components/Newsletter';

export default function AboutPage() {
  return (
    <main className="bg-[#F2F0EB] text-[#14161a]">
      <div className="max-w-4xl mx-auto px-6 py-20 md:py-28">
        {/* Header */}
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#14161a]/45 mb-5">
          About
        </p>

        <h1 className="text-[42px] md:text-[64px] font-semibold uppercase tracking-[0.14em] leading-none mb-8">
          RYVOL
        </h1>

        <p className="max-w-xl text-[13px] uppercase tracking-[0.32em] leading-7 text-[#14161a]/45 mb-16">
          Built for those still becoming.
        </p>

        {/* The Name */}
        <section className="mb-14">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#14161a]/40 mb-5">
            The Name
          </p>

          <p className="text-[17px] md:text-lg leading-[1.9] text-[#14161a]/80">
            RYVOL is a made-up word. That&apos;s the point. It didn&apos;t exist
            until we built it, the same way nothing you want exists until you go
            get it. It carries rival in it, and revolve, and revolution. But the
            rival isn&apos;t another team, another player, or another brand.
            It&apos;s who you were yesterday.
          </p>
        </section>

        {/* The Pursuit */}
        <section className="mb-14">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#14161a]/40 mb-5">
            The Pursuit
          </p>

          <p className="text-[17px] md:text-lg leading-[1.9] text-[#14161a]/80">
            We come from football. From fields where nobody&apos;s watching,
            hours before anybody shows up, players running the same route until
            it&apos;s clean. The kid with no stars next to their name. The one
            the rankings missed. Not the underdog. We don&apos;t do underdog
            stories. Underdogs need permission. This is a winner&apos;s brand
            for people who never waited for the invitation.
          </p>
        </section>

        {/* The Product */}
        <section className="mb-16">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#14161a]/40 mb-5">
            The Product
          </p>

          <p className="text-[17px] md:text-lg leading-[1.9] text-[#14161a]/80">
            No loud logos. No empty hype. Heavyweight blanks, clean marks, built
            to be trained in, lived in, and worn out. Every piece is made for
            people in motion, physically, mentally, and in whatever they&apos;re
            building.
          </p>
        </section>

        {/* Tagline Block */}
        <section className="border-y border-[#14161a]/12 py-20 mb-24 text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] text-[#14161a]/45 mb-4">
            The Standard
          </p>

          <p className="text-[22px] md:text-[30px] font-semibold uppercase tracking-[0.24em]">
            Unryvoled Pursuit
            <span className="text-[#A1543E]">.</span>
          </p>

          <p className="mt-6 max-w-md mx-auto text-[13px] leading-[1.8] text-[#14161a]/60">
            Unrivaled effort. Unresolved hunger. A pursuit that doesn&apos;t end
            when the season does. Not against anyone. Just your own limits.
          </p>
        </section>

        {/* FAQ */}
        <section className="border-t border-[#14161a]/10 pt-12 mb-20">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#14161a]/45 mb-4">
            Questions
          </p>

          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.24em] text-[#14161a] hover:text-[#A1543E] transition"
          >
            View FAQ →
          </Link>
        </section>

        {/* CTA to Shop */}
        <section className="text-center mb-20">
          <p className="text-[11px] uppercase tracking-[0.34em] text-[#14161a]/45 mb-8">
            The Pursuit Never Ends.
          </p>

          <Link
            href="/shop"
            className="inline-block px-9 py-4 bg-[#14161a] text-[#F2F0EB] text-[10px] uppercase tracking-[0.32em] hover:bg-[#A1543E] transition"
          >
            Shop the Drop
          </Link>
        </section>

        <Newsletter />

        {/* Socials */}
        <div className="text-center mt-24 pb-20">
          <h3 className="text-[11px] uppercase tracking-[0.3em] text-[#14161a]/60 mb-5">
            Follow the Pursuit
          </h3>

          <div className="flex justify-center gap-6 text-[#14161a] text-2xl">
            <a
              href="https://www.instagram.com/shopryvol"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram className="hover:text-[#A1543E] transition" />
            </a>

            <a
              href="https://www.tiktok.com/@shopryvol"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <FaTiktok className="hover:text-[#A1543E] transition" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}