'use client';
/* eslint-disable @next/next/no-img-element -- small brand/placeholder assets;
   photo availability is decided server-side (see app/page.tsx), so there's
   no client-side guessing here. */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Newsletter from '@/components/Newsletter';
import { FaInstagram, FaTiktok, FaChevronLeft, FaChevronRight, FaPlay } from 'react-icons/fa';

// RYVOL — coastal apparel, quiet and restrained. Palette: cream #F2F0EB |
// stone #C8C4BC | charcoal #2A2A2A | ink #14161a | navy var(--rv-navy).
// The brand doesn't explain itself, so the layout doesn't either: no drop
// countdowns, no hype copy, no loud CTAs — just the pieces, named and priced.

// `id` matches the /public/drop-01 image filenames (and the
// dropAvailability keys computed from them in app/page.tsx) — it's not
// the Sanity product id, hence the separate `productId` field below used
// for routing to the actual product page.
const DROP_ITEMS = [
  {
    id: 'men-dolphin-tee',
    productId: 'dolphin-tee',
    name: 'The Dolphin Tee',
    subtitle: "Men's — Heavyweight Cotton",
    image: '/drop-01/men-dolphin-tee.jpg',
  },
  {
    id: 'women-ringer-tee',
    productId: 'ringer-tee',
    name: 'The Ringer Tee',
    subtitle: "Women's — Fitted Cotton",
    image: '/drop-01/women-ringer-tee.jpg',
  },
  {
    id: 'current-tote',
    productId: 'current-tote',
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
    productId: 'dolphin-tee',
    name: 'The Dolphin Tee',
    subtitle: "Men's — Heavyweight Cotton — Sand",
    hero: '/drop-01/campaign/dolphin-tee-01.jpg',
    detail: ['/drop-01/campaign/dolphin-tee-02.jpg', '/drop-01/campaign/dolphin-tee-flatlay.jpg'],
    align: 'left' as const,
  },
  {
    id: 'ringer-tee',
    productId: 'ringer-tee',
    name: 'The Ringer Tee',
    subtitle: "Women's — Fitted Cotton — White",
    hero: '/drop-01/campaign/ringer-tee-01.jpg',
    detail: ['/drop-01/campaign/ringer-tee-02.jpg', '/drop-01/campaign/ringer-tee-flatlay-styled.jpg'],
    align: 'right' as const,
  },
  {
    id: 'current-tote',
    productId: 'current-tote',
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
 *  or in a loading state. One review at a time, stepped through with
 *  quiet arrows either side — reads more like a considered pull-quote
 *  than a wall of cards. */
function ReviewsHomeSection() {
  const [reviews, setReviews] = useState<HomeReview[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch('/api/reviews/recent?limit=6')
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews || []))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded || reviews.length === 0) return null;

  const review = reviews[index];
  const canStep = reviews.length > 1;
  const goPrev = () => setIndex((i) => (i - 1 + reviews.length) % reviews.length);
  const goNext = () => setIndex((i) => (i + 1) % reviews.length);

  return (
    <section className="w-full border-t border-[#14161a]/10">
      <div className="max-w-[680px] mx-auto px-6 md:px-10 py-20 md:py-28 text-center">
        <p className="rv-serif italic text-[22px] md:text-[26px] text-[#14161a] mb-16 md:mb-20">
          In their words.
        </p>

        <div key={review.id} className="rv-fade">
          <ReviewStars rating={review.rating} />
          <p className="rv-serif italic text-[19px] md:text-[22px] leading-[1.55] text-[#14161a] mt-5 mb-5">
            &ldquo;{review.text}&rdquo;
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#14161a]/45">
            {review.name}
          </p>
        </div>

        {canStep && (
          <div className="mt-14 flex items-center justify-center gap-8">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous review"
              className="text-[#14161a]/40 hover:text-[#14161a] transition p-2 -m-2"
            >
              <FaChevronLeft size={12} />
            </button>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#14161a]/35 tabular-nums">
              {String(index + 1).padStart(2, '0')} — {String(reviews.length).padStart(2, '0')}
            </p>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next review"
              className="text-[#14161a]/40 hover:text-[#14161a] transition p-2 -m-2"
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default function HomeClient({
  dropAvailability = {},
}: {
  dropAvailability?: DropAvailability;
}) {
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  // Assume it's playing until proven otherwise — most visitors autoplay
  // fine, so this avoids a flash of the play button on every load.
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  // Mobile autoplay is gated on the video's live `muted` property being
  // true at the moment playback is attempted — the `muted` JSX attribute
  // above sets it in most cases, but React/hydration timing can lose it
  // on some mobile browsers, which silently blocks autoplay with no
  // error (the video just sits on the poster frame). Setting it directly
  // and explicitly calling play() here is the standard fix — a harmless
  // no-op if the attribute already worked. Some platforms block autoplay
  // outright regardless (iOS Low Power Mode, for one) — the promise
  // rejecting is how we know to show the manual play button instead.
  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    video.muted = true;
    const playPromise = video.play();
    if (playPromise) {
      playPromise.then(() => setIsVideoPlaying(true)).catch(() => setIsVideoPlaying(false));
    }
  }, []);

  const handlePlayClick = () => {
    const video = heroVideoRef.current;
    if (!video) return;
    // A direct response to a tap is exempt from autoplay restrictions,
    // so this works even under Low Power Mode.
    video.play().then(() => setIsVideoPlaying(true)).catch(() => {});
  };

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
        .rv-fade { animation: rvFade 400ms ease; }
        @keyframes rvFade { from { opacity: 0; } to { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .rv-reveal { opacity: 1; transform: none; transition: none; }
          .rv-fade { animation: none; }
        }
      `}</style>

      {/* Hero — the dolphin footage looping full-bleed behind the mark.
          Everything else on the page stays static/quiet; this is the one
          deliberate moment of motion, so it gets the full viewport. */}
      <section className="relative w-full min-h-[92vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-[#0B0F14]">
        <div className="absolute inset-0">
          <video
            ref={heroVideoRef}
            // No `autoplay` attribute on purpose — playback is started by
            // the effect below via video.play() instead. When the
            // declarative `autoplay` attribute is the one that fails
            // (e.g. iOS Low Power Mode), WebKit shows its own big native
            // play icon centered over the video, on top of everything.
            // A script-driven play() call that gets rejected doesn't
            // trigger that native fallback UI, so this keeps the only
            // play button the small one we built.
            muted
            loop
            playsInline
            poster="/drop-01/hero-dolphins-poster.jpg"
            onPlaying={() => setIsVideoPlaying(true)}
            onPause={() => setIsVideoPlaying(false)}
            className="absolute left-1/2 top-1/2 h-full w-full min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover"
          >
            <source src="/drop-01/hero-dolphins.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F14]/55 via-[#0B0F14]/20 to-[#0B0F14]/60" />
        </div>

        {/* Manual play control — only shown when autoplay didn't happen
            (Low Power Mode, a browser that blocks it outright, etc.), so
            the poster frame never feels like a dead end. */}
        {!isVideoPlaying && (
          <button
            type="button"
            onClick={handlePlayClick}
            aria-label="Play video"
            className="absolute bottom-28 right-6 md:bottom-28 md:right-10 z-10 w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#0B0F14]/30 backdrop-blur-sm border border-[#F2F0EB]/40 flex items-center justify-center hover:bg-[#0B0F14]/45 hover:border-[#F2F0EB]/70 transition"
          >
            <FaPlay size={12} className="text-[#F2F0EB] translate-x-[1px]" />
          </button>
        )}

        <div className="relative px-6 py-24 max-w-[560px] mx-auto flex flex-col items-center text-center">
          <img
            src="/brand/ryvol-emblem-line-cream.png"
            alt="RYVOL"
            className="rv-reveal w-12 h-12 md:w-14 md:h-14 mb-10"
          />

          <h1 className="rv-serif italic rv-reveal text-[42px] md:text-[60px] leading-[1.08] text-[#F2F0EB]">
            Follow the Current.
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

      {/* Early newsletter — first thing after the hero, so it isn't missed
          at the bottom of the page. Uses the poster art rather than a
          form floating on cream, same restrained pairing as Campaign. */}
      <section className="w-full border-t border-[#14161a]/10">
        <div className="max-w-[1180px] mx-auto px-6 md:px-10 py-20 md:py-28 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-6 rv-reveal">
            <div className="relative aspect-[3/4] overflow-hidden bg-[#EDEAE3]">
              <img
                src="/brand/newsletter-poster.png"
                alt="RYVOL"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="md:col-span-6 rv-reveal">
            <p className="rv-serif italic text-[22px] md:text-[26px] text-[#14161a] mb-3">
              Before it drops.
            </p>
            <p className="text-[#14161a]/50 mb-8 text-[12px] uppercase tracking-[0.18em]">
              First access, restock notices, nothing else.
            </p>
            <Newsletter showHeading={false} align="left" compact />
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
              <Link key={item.id} href={`/shop/${item.productId}`} className="group rv-reveal block">
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
              </Link>
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
              <Link href={`/shop/${item.productId}`} className="relative aspect-[4/5] overflow-hidden bg-[#EDEAE3] block group">
                <img
                  src={item.hero}
                  alt={item.name}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.015]"
                />
              </Link>
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
                  <Link
                    key={src}
                    href={`/shop/${item.productId}`}
                    className="relative aspect-[4/5] overflow-hidden bg-[#EDEAE3] block"
                  >
                    <img
                      src={src}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </Link>
                ))}
              </div>

              <Link
                href={`/shop/${item.productId}`}
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
