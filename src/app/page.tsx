'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useAnimation } from 'framer-motion';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import Newsletter from '../components/Newsletter';
import UserStatus from '../components/UserStatus';
import ScrollPopup from '../components/ScrollPopup';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

function ScrollVerseManager({
  onShowVerse,
  hasPopupShown,
  setHasPopupShown,
}: {
  onShowVerse: () => void;
  hasPopupShown: boolean;
  setHasPopupShown: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const welcomeName = searchParams.get('welcomeName');
    const justLoggedIn = sessionStorage.getItem('justLoggedIn') === 'true';

    if ((welcomeName || justLoggedIn) && !hasPopupShown) {
      onShowVerse();
      setHasPopupShown(true);
      sessionStorage.removeItem('justLoggedIn');
    }
  }, [searchParams, hasPopupShown, onShowVerse, setHasPopupShown]);

  return null;
}

export default function HomePage() {
  const logoControls = useAnimation();
  const jacketControls = useAnimation();
  const navControls = useAnimation();
  const leftControls = useAnimation();
  const priceControls = useAnimation();
  const { data: session } = useSession();

  const [showScrollVerse, setShowScrollVerse] = useState(false);
  const [showScrollLogin, setShowScrollLogin] = useState(false);
  const [hasPopupShown, setHasPopupShown] = useState(false);
  const [showLine, setShowLine] = useState(false);
  const [hideSmallLogo, setHideSmallLogo] = useState(false);

  const handleLogin = async () => {
    sessionStorage.setItem('justLoggedIn', 'true');
    await signIn('credentials', { redirect: true, callbackUrl: '/' });
  };

  useEffect(() => {
    const handleScrollLogin = () => {
      setShowScrollLogin(window.scrollY >= 100);
    };
    window.addEventListener('scroll', handleScrollLogin);
    return () => window.removeEventListener('scroll', handleScrollLogin);
  }, []);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('homeAnimationPlayed');
    if (!hasVisited) {
      sessionStorage.setItem('homeAnimationPlayed', 'true');
      const sequence = async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setShowLine(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setShowLine(false);
        setHideSmallLogo(true);
        await logoControls.start({
          scale: 1.15,
          opacity: 1,
          y: 60,
          transition: { duration: 0.8, ease: 'easeOut' },
        });
        await jacketControls.start({
          opacity: 1,
          transition: { duration: 0.6 },
        });
        navControls.start({ opacity: 1, x: 0, transition: { duration: 0.6 } });
        leftControls.start({ opacity: 1, x: 0, transition: { duration: 0.6 } });
        priceControls.start({ opacity: 1, x: 0, transition: { duration: 0.6 } });
      };
      sequence();
    } else {
      setHideSmallLogo(true);
      logoControls.set({ scale: 1.15, opacity: 1, y: 60 });
      jacketControls.set({ opacity: 1 });
      navControls.set({ opacity: 1, x: 0 });
      leftControls.set({ opacity: 1, x: 0 });
      priceControls.set({ opacity: 1, x: 0 });
    }
  }, [logoControls, jacketControls, navControls, leftControls, priceControls]);

  useEffect(() => {
    if (!showScrollVerse) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.scroll-popup-container')) {
        setShowScrollVerse(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [showScrollVerse]);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ScrollVerseManager
          onShowVerse={() => setShowScrollVerse(true)}
          hasPopupShown={hasPopupShown}
          setHasPopupShown={setHasPopupShown}
        />
      </Suspense>

      <div className="bg-white min-h-screen flex flex-col relative overflow-hidden">
        {!hideSmallLogo && (
          <div className="absolute top-[12%] md:top-[18%] left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2">
            <Image src="/small-logo.png" alt="Small Logo" width={95} height={60} priority />
          </div>
        )}

        {showLine && (
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="absolute top-[12%] md:top-[18%] left-0 h-[2px] bg-black z-40"
            style={{ transform: 'translateY(-50%)' }}
          />
        )}
<div className="w-full overflow-hidden relative z-40">
  <motion.div
    initial={{ x: '100%' }}
    animate={{ x: '-100%' }}
    transition={{ repeat: Infinity, ease: 'linear', duration: 10 }}
    className="whitespace-nowrap text-white py-2 text-sm font-semibold flex w-max bg-black"
  >
    <span className="mx-12 inline-block">SUMMER DROP ☀️ — LIVE NOW</span>
    <span className="mx-12 inline-block">SUMMER DROP ☀️ — LIVE NOW</span>
    <span className="mx-12 inline-block">SUMMER DROP ☀️ — LIVE NOW</span>
    <span className="mx-12 inline-block">SUMMER DROP ☀️ — LIVE NOW</span>
  </motion.div>
</div>


        <main className="flex flex-1 max-w-[1200px] mx-auto p-8 gap-20 relative items-start w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={leftControls}
            className="flex flex-col justify-center items-center max-w-xs z-12 text-black ml-24 mt-20 text-center"
          >
            <h1 className="text-3xl font-bold leading-tight">
              <span className="block">Evangelical</span>
              <span className="block">Threads</span>
            </h1>
            <div className="mt-8 max-w-[220px]">
              <p className="text-lg font-light leading-snug">Faith driven fashion</p>
              <p className="text-lg font-bold leading-snug mt-1">combined with tech</p>
            </div>
            <Link
              href="/shop"
              className="mt-8 px-6 py-2 border-2 border-black text-black font-semibold hover:bg-black hover:text-white transition duration-300 ease-in-out max-w-[120px]"
            >
              Buy Now
            </Link>
          </motion.div>

          <div className="relative flex-1 flex justify-center items-center overflow-visible">
            <motion.div
              initial={{ scale: 0.1, opacity: 0 }}
              animate={logoControls}
              className="relative w-[80vw] max-w-[950px]"
              style={{ marginLeft: '-60%' }}
            >
              <Image src="/big-logo.svg" alt="Big Logo" width={950} height={475} priority />
              <motion.div
                initial={{ opacity: 0 }}
                animate={jacketControls}
                className="absolute"
                style={{
                  top: '43%',
                  left: '60%',
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                  zIndex: 25,
                }}
              >
                <Image src="/jacket.svg" alt="Jacket" width={400} height={400} priority />
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={priceControls}
            className="absolute bottom-8 right-5 flex flex-col items-end text-black z-10"
          >
            <p className="text-sm">Starting at</p>
            <p className="text-3xl font-bold -mt-1">$45</p>
          </motion.div>
        </main>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap justify-center gap-6 mt-12 px-4"
        >
          {[
            { src: '/model-jacket.png', alt: 'Model Jacket', link: '/shop' },
            { src: '/model-girl.png', alt: 'Model Girl', link: '/shop' },
            { src: '/model-guy.png', alt: 'Model Guy', link: '/shop' },
          ].map((model, idx) => (
            <Link
              key={idx}
              href={model.link}
              className="relative w-64 sm:w-72 md:w-80 lg:w-[22rem] xl:w-[24rem] h-[24rem] md:h-[26rem] lg:h-[28rem] group overflow-hidden rounded-2xl shadow-md block"
            >
              <Image
                src={model.src}
                alt={model.alt}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-500 transform group-hover:scale-105"
                priority
              />
              <div className="hidden md:block absolute bottom-0 left-0 w-full bg-black/60 text-white text-center py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-sm font-semibold">Shop Now</span>
              </div>
              <div className="md:hidden absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded-md z-10">
                Shop Now
              </div>
            </Link>
          ))}
        </motion.div>

        <Newsletter />

        <div className="text-center mb-12">
          <h3 className="text-lg font-semibold text-black mb-2">Follow us</h3>
          <div className="flex justify-center gap-6 text-black text-2xl">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok">
              <FaTiktok />
            </a>
          </div>
        </div>

        {!session && showScrollLogin && (
          <div className="fixed bottom-5 right-5 bg-white shadow-lg rounded-md p-4 max-w-xs z-50">
            <p className="mb-2">Log in to see personalized verses.</p>
            <button
              onClick={handleLogin}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            >
              Log In
            </button>
          </div>
        )}

        <UserStatus />

        {session && (
          <ScrollPopup
            isVisible={showScrollVerse}
            onClose={() => setShowScrollVerse(false)}
            verseText={`“You are the light of the world.” — Matthew 5:14`}
            className="scroll-popup-container"
          />
        )}
      {/* Spacer to prevent overlap on mobile */}
<div className="block sm:hidden h-24" />
</div>
    </>
  );
}
