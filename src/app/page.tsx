'use client';

import Image from 'next/image';
import Link from 'next/link';
import Newsletter from '@/components/Newsletter';
import { FaInstagram, FaTiktok } from 'react-icons/fa6';

export default function HomePage() {
  const collectionCards = [
    {
      title: 'Front View',
      image: '/city.png',
      href: '/shop',
      imageClass: 'object-cover object-[50%_22%]',
    },
    {
      title: 'Back Graphic',
      image: '/sunset.png',
      href: '/shop',
      imageClass: 'object-cover object-[50%_18%]',
    },
    {
      title: 'On Body',
      image: '/beach.png',
      href: '/shop',
      imageClass: 'object-cover object-[50%_20%]',
    },
  ];

  return (
    <div className="bg-white min-h-screen">

{/* Hero */}
<section className="relative w-full h-[64vh] min-h-[430px] md:h-[86vh] md:min-h-[720px] overflow-hidden bg-[#f5f5f3]">

  <Image
    src="/hero-image.png"
    alt="God's World Collection"
    fill
    priority
    sizes="100vw"
    className="object-cover object-[53%_center] md:object-[54%_center]"
  />

  <div className="absolute inset-0 bg-black/10" />

  <div className="absolute inset-0">
    <div className="relative w-full h-full">

      <div className="absolute bottom-12 right-0 w-[52%] md:bottom-16 md:left-1/2 md:right-auto md:w-full md:-translate-x-1/2">

        <div className="text-white text-left md:text-center">

          <p className="text-[10px] md:text-xs tracking-[0.28em] uppercase mb-3 md:mb-4">
            New Drop
          </p>

          <h1 className="text-[26px] leading-[0.95] md:text-[72px] md:leading-[0.98] font-medium tracking-[-0.03em]">
            God&apos;s World Collection
          </h1>

          <Link
            href="/shop"
            className="inline-block mt-4 md:mt-5 text-[14px] md:text-lg underline underline-offset-4 hover:opacity-75 transition"
          >
            Shop Now
          </Link>

        </div>
      </div>

    </div>
  </div>
</section>
{/* Collection Grid */}
<section className="w-full border-t border-black/10 bg-white">
  <div className="max-w-[1180px] mx-auto px-5 md:px-8 py-16 md:py-24">

    <div className="mb-10 md:mb-14 text-center">
      <p className="text-[11px] md:text-xs uppercase tracking-[0.28em] text-black/55 mb-3">
        Collection
      </p>
      <h2 className="text-[34px] md:text-[56px] leading-none font-medium tracking-[-0.04em] text-black">
        God&apos;s World
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
      {collectionCards.map((item, index) => (
        <Link key={index} href={item.href} className="group block">
          <div className="relative aspect-[4/5.2] overflow-hidden bg-[#f5f5f3]">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className={`${item.imageClass} transition duration-700 ease-out group-hover:scale-[1.04]`}
            />
          </div>

          <div className="pt-4 md:pt-5 text-center">
            <p className="text-[15px] md:text-[19px] text-black tracking-[-0.02em]">
              {item.title}
            </p>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>

      {/* Split Video Section */}
      <section className="w-full h-screen overflow-hidden bg-white">

        <div className="grid grid-cols-2 h-full w-full">

          <div className="relative h-full w-full overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: 'center 20%' }}
            >
              <source src="/mvi-8191-2.mp4" type="video/mp4" />
            </video>
          </div>

          <div className="relative h-full w-full overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: 'center center' }}
            >
              <source src="/mvi-8472.mp4" type="video/mp4" />
            </video>
          </div>

        </div>
      </section>

           <Newsletter />

      <div className="text-center mb-12">
        <h3 className="text-lg font-semibold text-black mb-2">Follow us</h3>
        <div className="flex justify-center gap-6 text-black text-2xl">
          <a
            href="https://www.instagram.com/evangelicalthreads"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.tiktok.com/@evangelicalthreads"
            target="_blank"
            rel="noreferrer"
            aria-label="TikTok"
          >
            <FaTiktok />
          </a>
        </div>
      </div>
    </div>
  );
}
