'use client';

import Link from 'next/link';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import Newsletter from '../../components/Newsletter';

export default function AboutPage() {
  return (
    <main className="bg-[#F2F0EB] text-[#14161a]">
      <div className="max-w-3xl mx-auto px-6 py-20 md:py-28">

        {/* Header */}
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#14161a]/45 mb-5">
          About
        </p>
        <h1 className="text-[30px] md:text-[44px] font-semibold uppercase tracking-[0.18em] leading-[1.15] mb-12">
          Ryvol
        </h1>

        {/* The name */}
        <p className="text-[17px] md:text-lg leading-[1.8] text-[#14161a]/80 mb-8">
          RYVOL is a made-up word. That&apos;s the point. It didn&apos;t exist until we
          built it, the same way nothing you want exists until you go get it. It carries
          rival in it, and revolve, and revolution. But the rival isn&apos;t another team,
          another player, another brand. It&apos;s who you were yesterday.
        </p>

        <p className="text-[17px] md:text-lg leading-[1.8] text-[#14161a]/80 mb-8">
          We come from football. From fields where nobody&apos;s watching, hours before
          anybody shows up, players running the same route until it&apos;s clean. The kid
          with no stars next to their name. The one the rankings missed. Not the underdog,
          we don&apos;t do underdog stories. Underdogs need permission. This is a
          winner&apos;s brand for people who never waited for the invitation.
        </p>

        <p className="text-[17px] md:text-lg leading-[1.8] text-[#14161a]/80 mb-14">
          No loud logos. No empty hype. Heavyweight blanks, clean marks, built to be
          trained in, lived in, worn out. Every piece is made for people in motion,
          physically, mentally, in whatever they&apos;re building.
        </p>

        {/* Tagline block */}
        <section className="border-y border-[#14161a]/12 py-12 mb-16 text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] text-[#14161a]/45 mb-4">
            The Standard
          </p>
          <p className="text-[22px] md:text-[30px] font-semibold uppercase tracking-[0.24em]">
            Unryvoled Pursuit<span className="text-[#A1543E]">.</span>
          </p>
          <p className="mt-5 text-[13px] leading-[1.8] text-[#14161a]/60 max-w-md mx-auto">
            Unrivaled effort. Unresolved hunger. A pursuit that doesn&apos;t
            end when the season does. Not against anyone. Just your own limits.
          </p>
        </section>

        {/* CTA to shop */}
        <section className="text-center mb-20">
          <Link
            href="/shop"
            className="inline-block px-9 py-4 bg-[#14161a] text-[#F2F0EB] text-[10px] uppercase tracking-[0.32em] hover:bg-[#A1543E] transition"
          >
            Shop the Drop
          </Link>
        </section>

        <Newsletter />

        {/* Socials */}
        <div className="text-center mt-16">
          <h3 className="text-[11px] uppercase tracking-[0.3em] text-[#14161a]/60 mb-5">
            Follow the Pursuit
          </h3>
          <div className="flex justify-center gap-6 text-[#14161a] text-2xl">
            <a
              href="https://www.instagram.com/shopryvol" // TODO: confirm handle
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram className="hover:text-[#A1543E] transition" />
            </a>
            <a
              href="https://www.tiktok.com/@shopryvol" // TODO: confirm handle
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
