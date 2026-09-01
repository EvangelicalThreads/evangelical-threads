'use client';
/* eslint-disable @next/next/no-img-element -- small brand/placeholder assets;
   photo availability is decided server-side (see app/page.tsx), so there's
   no client-side guessing here. */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Newsletter from '@/components/Newsletter';
import { FaInstagram, FaTiktok } from 'react-icons/fa';

// RYVOL — coastal apparel, quiet and restrained. Palette: cream #F2F0EB |
// stone #C8C4BC | charcoal #2A2A2A | ink #14161a | navy var(--rv-navy).
// The brand doesn't explain itself, so the layout doesn't either: no drop
// countdowns, no hype copy, no loud CTAs — just the pieces, named and priced.

const DROP_ITEMS = [
  {
    id: 'men-dolphin-tee',
    name: 'The Dolphin Tee',
    subtitle: "Men's — Heavyweight Cotton",
    image: '/drop-01/men-dolphin-tee.jpg',
  },
  {
    id: 'women-ringer-tee',
    name: 'The Ringer Tee',
    subtitle: "Women's — Fitted Cotton",
    image: '/drop-01/women-ringer-tee.jpg',
  },
  {
    id: 'current-tote',
    name: 'The Current Tote',
    subtitle: 'Canvas — One Size',
    image: '/drop-01/current-tote.jpg',
  },
] as const;

type DropAvailability = Partial<Record<(typeof DROP_ITEMS)[number]['id'], boolean>>;

// Editorial campaign imagery — one long-form section per piece, shot on the
// Southern California coastline. Text stays to a name and a material line;
// the photography carries the rest.
const CAMPAIGN = [
  {
    id: 'dolphin-tee',
    name: 'The Dolphin Tee',
    subtitle: "Men's — Heavyweight Cotton — Sand",
    hero: '/drop-01/campaign/dolphin-tee-01.jpg',
    detail: ['/drop-01/campaign/dolphin-tee-02.jpg', '/drop-01/campaign/dolphin-tee-flatlay.jpg'],
    align: 'left' as const,
  },
  {
    id: 'ringer-tee',
    name: 'The Ringer Tee',
    subtitle: "Women's — Fitted Cotton — White",
    hero: '/drop-01/campaign/ringer-tee-01.jpg',
    detail: ['/drop-01/campaign/ringer-tee-02.jpg', '/drop-01/campaign/ringer-tee-flatlay-styled.jpg'],
    align: 'right' as const,
  },
  {
    id: 'current-tote',
    name: 'The Current Tote',
    subtitle: 'Canvas — One Size — Navy',
    hero: '/drop-01/campaign/current-tote-01.jpg',
    detail: ['/drop-01/campaign/current-tote-detail.jpg', '/drop-01/campaign/current-tote-02.jpg'],
    align: 'left' as const,
  },
];

/** Real photo if it exists in /public/drop-01/ (checked server-side, so
 *  there's never a broken-image flash); a quiet, unlabeled placeholder
 *  otherwise. Drop the file in with the matching name and it appears on
 *  the next request — no code changes. */
function DropTile({
  image,
  alt,
  available,
}: {
  image: string;
  alt: string;
  available?: boolean;
}) {
  if (!available) {
    return (
      <div className="absolute inset-0 bg-[#EDEAE3] flex items-center justify-center">
        <img
          src="/brand/ryvol-emblem-line-ink.png"
          alt=""
          aria-hidden="true"
          className="w-[22%] opacity-[0.12] select-none"
        />
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={alt}
      className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.015]"
    />
  );
}

type HomeReview = {
  id: string;
  name: string;
  rating: number;
  text: string;
  created_at: string;
};

function ReviewStars({ rating }: { rating: number }) {
  return (
    <span className="text-[13px] tracking-[0.12em] text-[var(--rv-navy)]">
      {'★'.repeat(rating)}
      <span className="text-[#14161a]/15">{'★'.repeat(5 - rating)}</span>
    </span>
  );
}

/** Recent reviews, pulled live from /api/reviews/recent. Renders nothing
 *  at all until there's real proof to show — this is a trust-building
 *  moment on the homepage, not a section that should ever appear empty
 *  or in a loading state. */
function ReviewsHomeSection() {
  const [reviews, setReviews] = useState<HomeReview[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/reviews/recent?limit=6')
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews || []))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded || reviews.length === 0) return null;

  return (
    <section className="w-full border-t border-[#14161a]/10">
      <div className="max-w-[1180px] mx-auto px-6 md:px-10 py-20 md:py-28">
        <p className="rv-serif italic text-center text-[22px] md:text-[26px] text-[#14161a] mb-16 md:mb-20">
          In their words.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-14 md:gap-x-14">
          {reviews.map((review) => (
            <div key={review.id} className="text-center sm:text-left">
              <ReviewStars rating={review.rating} />
              <p className="rv-serif italic text-[17px] md:text-[18px] leading-[1.5] text-[#14161a] mt-4 mb-4">
                &ldquo;{review.text}&rdquo;
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#14161a]/45">
                {review.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomeClient({
  dropAvailability = {},
}: {
  dropAvailability?: DropAvailability;
}) {
  // scroll reveal
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('rv-in');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 }
    );
    document.querySelectorAll('.rv-reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="bg-[#F2F0EB] min-h-screen text-[#14161a]">

      <style>{`
        .rv-reveal { opacity: 0; transform: translateY(16px);
          transition: opacity 1s ease, transform 1s cubic-bezier(.2,.7,.2,1); }
        .rv-in { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) {
          .rv-reveal { opacity: 1; transform: none; transition: none; }
        }
      `}</style>

      {/* Hero — the dolphin footage looping full-bleed behind the mark.
          Everything else on the page stays static/quiet; this is the one
          deliberate moment of motion, so it gets the full viewport. */}
      <section className="relative w-full min-h-[92vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-[#0B0F14]">
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/drop-01/hero-dolphins-poster.jpg"
            className="absolute left-1/2 top-1/2 h-full w-full min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover"
          >
            <source src="/drop-01/hero-dolphins.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F14]/55 via-[#0B0F14]/20 to-[#0B0F14]/60" />
        </div>

        <div className="relative px-6 py-24 max-w-[560px] mx-auto flex flex-col items-center text-center">
          <img
            src="/brand/ryvol-emblem-line-cream.png"
            alt="RYVOL"
            className="rv-reveal w-12 h-12 md:w-14 md:h-14 mb-10"
          />

          <h1 className="rv-serif italic rv-reveal text-[42px] md:text-[60px] leading-[1.08] text-[#F2F0EB]">
            Unryvoled Pursuit.
          </h1>

          <div className="rv-reveal mt-10 flex items-center gap-8 text-[11px] uppercase tracking-[0.22em] text-[#F2F0EB]/80">
            <Link
              href="/shop"
              className="border-b border-[#F2F0EB]/40 pb-0.5 hover:border-[#F2F0EB] hover:text-[#F2F0EB] transition"
            >
              Shop
            </Link>
            <Link
              href="#notify"
              className="border-b border-[#F2F0EB]/40 pb-0.5 hover:border-[#F2F0EB] hover:text-[#F2F0EB] transition"
            >
              Join the List
            </Link>
          </div>
        </div>
      </section>

      {/* Three pieces */}
      <section className="w-full border-t border-[#14161a]/10">
        <div className="max-w-[1180px] mx-auto px-6 md:px-10 py-20 md:py-28">
          <p className="rv-serif italic rv-reveal text-center text-[22px] md:text-[26px] text-[#14161a] mb-16 md:mb-20">
            Three pieces.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-16 md:gap-x-14">
            {DROP_ITEMS.map((item) => (
              <div key={item.id} className="group rv-reveal">
                <div className="relative aspect-[4/5.2] overflow-hidden bg-[#EDEAE3] mb-5">
                  <DropTile
                    image={item.image}
                    alt={item.name}
                    available={dropAvailability[item.id]}
                  />
                </div>
                <p className="rv-serif italic text-[19px] text-[#14161a]">{item.name}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#14161a]/45">
                  {item.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campaign — one editorial section per piece */}
      <section className="w-full border-t border-[#14161a]/10">
        {CAMPAIGN.map((item) => (
          <div
            key={item.id}
            className="max-w-[1280px] mx-auto px-6 md:px-10 py-20 md:py-32 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 items-center"
          >
            <div
              className={`md:col-span-7 rv-reveal ${
                item.align === 'right' ? 'md:order-2' : 'md:order-1'
              }`}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#EDEAE3]">
                <img
                  src={item.hero}
                  alt={item.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>

            <div
              className={`md:col-span-5 rv-reveal flex flex-col ${
                item.align === 'right' ? 'md:order-1 md:items-end md:text-right' : 'md:order-2'
              }`}
            >
              <p className="rv-serif italic text-[26px] md:text-[32px] text-[#14161a] mb-2">
                {item.name}
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#14161a]/45 mb-10">
                {item.subtitle}
              </p>

              <div className="grid grid-cols-2 gap-3 w-full max-w-[360px]">
                {item.detail.map((src) => (
                  <div key={src} className="relative aspect-[4/5] overflow-hidden bg-[#EDEAE3]">
                    <img
                      src={src}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>

              <Link
                href="/shop"
                className="mt-10 text-[11px] uppercase tracking-[0.22em] text-[#14161a]/70 border-b border-[#14161a]/30 pb-0.5 hover:border-[#14161a] hover:text-[#14161a] transition self-start md:self-auto"
                style={item.align === 'right' ? { alignSelf: 'flex-end' } : undefined}
              >
                Shop
              </Link>
            </div>
          </div>
        ))}
      </section>

      <ReviewsHomeSection />

      {/* Mark */}
      <section className="w-full border-t border-[#14161a]/10">
        <div className="max-w-[520px] mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center rv-reveal">
          <img
            src="/brand/ryvol-emblem-navy.png"
            alt="RYVOL"
            className="w-11 h-11 mb-8"
          />
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#14161a]/35 mb-7">
            Ref. 1376
          </p>
          <Link
            href="/about"
            className="text-[11px] uppercase tracking-[0.22em] text-[#14161a]/60 border-b border-[#14161a]/25 pb-0.5 hover:text-[#14161a] hover:border-[#14161a] transition"
          >
            About Ryvol
          </Link>
        </div>
      </section>

      <div id="notify" className="border-t border-[#14161a]/10">
        <Newsletter />
      </div>

      <div className="text-center mt-24 pb-20">
        <h3 className="text-[10px] uppercase tracking-[0.28em] text-[#14161a]/40 mb-5">
          Instagram — TikTok
        </h3>

        <div className="flex justify-center gap-6 text-[#14161a]/60 text-xl">
          <a
            href="https://www.instagram.com/shopryvol"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram className="hover:text-[#14161a] transition" />
          </a>

          <a
            href="https://www.tiktok.com/@shopryvol"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
          >
            <FaTiktok className="hover:text-[#14161a] transition" />
          </a>
        </div>
      </div>

    </div>
  );
}
