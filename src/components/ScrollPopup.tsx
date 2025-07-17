'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function ScrollPopup({
  isVisible,
  onClose,
  verseText,
  className = '',
}: {
  isVisible: boolean;
  onClose: () => void;
  verseText: string;
  className?: string;
}) {
  const { data: session } = useSession();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('scrollPopupShown');
    if (isVisible && !alreadyShown) {
      setShouldShow(true);
      sessionStorage.setItem('scrollPopupShown', 'true');
    }
  }, [isVisible]);

  const scrollVariants = {
    hidden: {
      height: 0,
      opacity: 0,
      scaleY: 0.2,
      rotateX: 90,
      transformOrigin: 'top center',
    },
    visible: {
      height: 520,
      opacity: 1,
      scaleY: 1,
      rotateX: 0,
      transformOrigin: 'top center',
      transition: { type: 'spring', stiffness: 280, damping: 30, mass: 0.7 },
    },
    exit: {
      height: 0,
      opacity: 0,
      scaleY: 0.2,
      rotateX: 90,
      transformOrigin: 'top center',
      transition: { duration: 0.6, ease: 'easeInOut' },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.2, duration: 0.8, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      y: -30,
      transition: { duration: 0.3, ease: 'easeIn' },
    },
  };

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          key="scroll-popup-overlay"
          className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 ${className}`}
          onClick={onClose}
        >
          <motion.div
            key="scroll-popup"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={scrollVariants}
            className="relative w-80 p-2"
            onClick={(e) => e.stopPropagation()}
            style={{ perspective: 700, transformStyle: 'preserve-3d' }}
          >
            {/* Magical sparkle effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-xl"
              style={{
                boxShadow:
                  '0 0 12px 4px rgba(252, 211, 77, 0.8), 0 0 24px 8px rgba(251, 191, 36, 0.6)',
                filter: 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.9))',
                mixBlendMode: 'screen',
              }}
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            />

            {/* Scroll container */}
            <div
              className="relative bg-gradient-to-b from-yellow-100 to-yellow-300 rounded-xl border-4 border-yellow-700 shadow-xl
              shadow-yellow-400/50 overflow-hidden font-serif text-yellow-900 select-text"
              style={{
                boxShadow:
                  '0 10px 15px rgba(184, 134, 11, 0.6), inset 0 0 15px #f3e3a9',
                filter: 'drop-shadow(0 4px 3px rgba(0,0,0,0.12))',
                userSelect: 'text',
                height: '100%',
                position: 'relative',
              }}
            >
              {/* Top scroll rod */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-7 bg-yellow-800 rounded-t-full shadow-inner
                before:absolute before:top-0 before:left-0 before:w-7 before:h-7 before:rounded-l-full before:bg-yellow-900
                after:absolute after:top-0 after:right-0 after:w-7 after:h-7 after:rounded-r-full after:bg-yellow-900"
                style={{ boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.4)' }}
              />

              {/* Bottom scroll rod */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-7 bg-yellow-800 rounded-b-full shadow-inner
                before:absolute before:bottom-0 before:left-0 before:w-7 before:h-7 before:rounded-l-full before:bg-yellow-900
                after:absolute after:bottom-0 after:right-0 after:w-7 after:h-7 after:rounded-r-full after:bg-yellow-900"
                style={{ boxShadow: 'inset 0 -2px 5px rgba(0,0,0,0.4)' }}
              />

              {/* Scroll content */}
              <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-8 pt-16 pb-16 relative z-10 text-center overflow-hidden"
                style={{ maxHeight: '460px', overflowY: 'auto' }}
              >
                <button
                  onClick={() => {
                    onClose();
                    setShouldShow(false);
                  }}
                  className="absolute top-4 right-5 text-yellow-900 hover:text-yellow-700 text-4xl font-bold"
                  aria-label="Close scroll"
                >
                  &times;
                </button>
                <h2 className="text-4xl font-semibold mb-8">
                  Hey {session?.user?.name || 'friend'}!
                </h2>
                <p className="text-lg leading-relaxed whitespace-pre-line">
                  {verseText}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
