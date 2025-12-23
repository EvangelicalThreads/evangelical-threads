'use client';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';


function NewsletterForm({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
        // wait a moment so user can see the message, then close
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 2000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 rounded-md border border-yellow-800 focus:outline-none focus:ring-2 focus:ring-gold text-black"
        required
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-gold text-black font-bold py-3 rounded-md hover:bg-yellow-600 transition disabled:opacity-50"
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
      {status === 'success' && (
        <p className="text-black text-center">Thanks for signing up! ✨</p>
      )}
      {status === 'error' && <p className="text-red-700 text-center">Something went wrong.</p>}
    </form>
  );
}


export default function EmailSignUpPopup({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const [shouldShow, setShouldShow] = useState(false);
  const [isClosing, setIsClosing] = useState(false); // NEW: tracks exit animation

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('newsletterPopupShown');
    if (isVisible && !alreadyShown) {
      setShouldShow(true);
      sessionStorage.setItem('newsletterPopupShown', 'true');
    }
  }, [isVisible]);

  const scrollVariants = {
    hidden: { height: 0, opacity: 0, scaleY: 0.2, rotateX: 90, transformOrigin: 'top center' },
    visible: {
      height: 520,
      opacity: 1,
      scaleY: 1,
      rotateX: 0,
      transformOrigin: 'top center',
      transition: { type: 'spring', stiffness: 280, damping: 30, mass: 0.7 },
    },
    exit: { height: 0, opacity: 0, scaleY: 0.2, rotateX: 90, transformOrigin: 'top center', transition: { duration: 0.6 } },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.8, ease: 'easeOut' } },
    exit: { opacity: 0, y: -30, transition: { duration: 0.3, ease: 'easeIn' } },
  };

  if (!shouldShow) return null;

  const handleClose = () => {
    setIsClosing(true); // trigger exit animation
    setTimeout(() => {
      setShouldShow(false); // remove from DOM after animation
      setIsClosing(false);
      onClose?.(); // call parent onClose
    }, 600); // match scrollVariants.exit.duration
  };

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          key="newsletter-popup-overlay"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 pointer-events-none"
          onClick={handleClose}
        >
          <motion.div
            key="newsletter-popup"
            initial="hidden"
            animate={isClosing ? 'exit' : 'visible'}
            exit="exit"
            variants={scrollVariants}
            className="relative w-80 p-2 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ perspective: 700, transformStyle: 'preserve-3d' }}
          >
            {/* Sparkle effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-xl"
              style={{
                boxShadow: '0 0 12px 4px rgba(252,211,77,0.8), 0 0 24px 8px rgba(251,191,36,0.6)',
                filter: 'drop-shadow(0 0 6px rgba(251,191,36,0.9))',
                mixBlendMode: 'screen',
              }}
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            />

            {/* Scroll container */}
            <div
              className="relative bg-gradient-to-b from-yellow-100 to-yellow-300 rounded-xl border-4 border-yellow-700 shadow-xl shadow-yellow-400/50 overflow-hidden font-serif text-yellow-900"
              style={{
                boxShadow: '0 10px 15px rgba(184,134,11,0.6), inset 0 0 15px #f3e3a9',
                filter: 'drop-shadow(0 4px 3px rgba(0,0,0,0.12))',
                userSelect: 'text',
                height: '100%',
                position: 'relative',
              }}
            >
              {/* Top rod */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-7 bg-yellow-800 rounded-t-full shadow-inner" />
              {/* Bottom rod */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-7 bg-yellow-800 rounded-b-full shadow-inner" />

              {/* Content */}
              <motion.div
                variants={contentVariants}
                initial="hidden"
                animate={isClosing ? 'exit' : 'visible'}
                exit="exit"
                className="p-6 pt-16 pb-16 relative z-10 text-center overflow-auto max-h-[460px]"
              >
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-5 text-yellow-900 hover:text-yellow-700 text-4xl font-bold"
                >
                  &times;
                </button>

                <h2 className="text-3xl font-bold mb-4">
                  {session?.user?.name ? `Hey ${session.user.name}!` : 'Hey friend!'}
                </h2>
                <p className="text-lg mb-6">Sign up to stay updated on drops & restocks ✨</p>

                <NewsletterForm 
                  onSuccess={handleClose} 
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
