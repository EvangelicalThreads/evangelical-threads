'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Newsletter from '@/components/Newsletter';
import { FaInstagram, FaTiktok } from 'react-icons/fa';

// RYVOL palette: off-white #F2F0EB | stone #C8C4BC | charcoal #2A2A2A | ink #14161a | rust #A1543E

export default function HomePage() {
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

  const collectionCards = [
    {
      title: 'Heavyweight Cotton',
      image: '/city.png', // TODO: RYVOL product shot — 5030 tee front
      href: '/shop',
      imageClass: 'object-cover object-[50%_22%]',
    },
    {
      title: 'Oversized Fit',
      image: '/sunset.png', // TODO: back graphic shot
      href: '/shop',
      imageClass: 'object-cover object-[50%_18%]',
    },
    {
      title: 'Built for Movement',
      image: '/beach.png', // TODO: on-body shot — 5146 hood / mesh short
      href: '/shop',
      imageClass: 'object-cover object-[38%_30%]'
    },
  ];

  return (
    <div className="bg-[#F2F0EB] min-h-screen text-[#14161a]">

      {/* marquee + reveal keyframes */}
      <style>{`
        @keyframes rv-scroll { to { transform: translateX(-50%); } }
        .rv-track { animation: rv-scroll 28s linear infinite; }
        .rv-reveal { opacity: 0; transform: translateY(22px);
          transition: opacity .8s ease, transform .8s cubic-bezier(.2,.7,.2,1); }
        .rv-in { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) {
          .rv-track { animation: none; }
          .rv-reveal { opacity: 1; transform: none; transition: none; }
        }
      `}</style>

      {/* Hero */}
      <section className="relative w-full h-[72vh] min-h-[480px] md:h-[86vh] md:min-h-[640px] overflow-hidden bg-[#b9b5ac]">
        <Image
          src="/hero-image.png" // TODO: monochrome hero — b&w, subject right, negative space left for copy
          alt="RYVOL — Unryvoled Pursuit"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[60%_center]"
        />

        {/* soft left scrim so ink type holds on any photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F2F0EB]/40 via-transparent to-transparent" />

        <div className="absolute left-[6vw] top-1/2 -translate-y-[58%] max-w-[560px]">
<h1 className="text-[22px] md:text-[42px] font-semibold uppercase tracking-[0.14em] leading-[1.15] text-[#14161a]">            <span className="block">Unryvoled</span>
            <span className="block mt-[0.55em]">Pursuit.</span>
          </h1>

          <Link
            href="/shop"
            className="inline-block mt-8 md:mt-10 px-8 py-3.5 bg-[#14161a] text-[#F2F0EB] text-[10px] uppercase tracking-[0.32em] hover:bg-[#A1543E] transition"
          >
            Explore
          </Link>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-b border-[#14161a]/10 py-[15px]" aria-hidden="true">
        <div className="rv-track flex gap-16 whitespace-nowrap w-max">
          {[0, 1].map((i) => (
            <span
              key={i}
              className="text-[11px] uppercase tracking-[0.4em] text-[#14161a]/55"
            >
              Unryvoled Pursuit <em className="not-italic text-[#A1543E]">—</em> First Drop Coming Soon{' '}
              <em className="not-italic text-[#A1543E]">—</em> Ryvol{' '}
              <em className="not-italic text-[#A1543E]">—</em>
            </span>
          ))}
        </div>
      </div>

      {/* Collection Grid */}
      <section className="w-full">
        <div className="max-w-[1180px] mx-auto px-5 md:px-8 py-20 md:py-24">

          <div className="mb-12 md:mb-14 text-center rv-reveal">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#A1543E] mb-4">
              First Drop
            </p>
            <h2 className="text-[26px] md:text-[44px] leading-none font-semibold tracking-[0.22em] uppercase">
              Ryvol 001
            </h2>
            <p className="mt-5 text-[11px] uppercase tracking-[0.24em] text-[#14161a]/55">
              Coming soon. 
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
            {collectionCards.map((item, index) => (
              <Link key={index} href={item.href} className="group block rv-reveal">
                <div className="relative aspect-[4/5.2] overflow-hidden bg-[#EDEAE3]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className={`${item.imageClass} transition duration-700 ease-out group-hover:scale-[1.04]`}
                  />
                </div>
                <div className="pt-4 md:pt-5 text-center">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[#14161a]/70">
                    {item.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Split Image Section */}
<section className="w-full h-[70vh] md:h-screen overflow-hidden">
  <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">

    <div className="relative h-full w-full overflow-hidden rv-reveal">
     <Image
  src="/split-image1.png"
  alt="UNRYVOLED PURSUIT."
  fill
  className="object-cover"
  style={{ objectPosition: '70% 10%' }}

      />
      <p className="absolute bottom-8 left-8 text-[12px] uppercase tracking-[0.3em] text-[#F2F0EB]">
        UNRYVOLED.
      </p>
    </div>

    <div className="relative h-full w-full overflow-hidden rv-reveal">
      <Image
        src="/split-image2.png"
        alt="RYVOL campaign"
        fill
        className="object-cover"
        style={{ objectPosition: 'center center' }}
      />
      <p className="absolute bottom-8 left-8 text-[12px] uppercase tracking-[0.3em] text-[#F2F0EB]">
        PURSUIT.
      </p>
    </div>

  </div>
</section>

<Newsletter />

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
  );
}
