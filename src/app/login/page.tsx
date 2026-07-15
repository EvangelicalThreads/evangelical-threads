'use client';

import { useState } from 'react';
import { signIn, signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Newsletter from '@/components/Newsletter';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// RYVOL palette: off-white #F2F0EB | ink #14161a | rust #A1543E

const inputClass =
  'border border-[#14161a]/25 bg-transparent px-5 py-3 text-[#14161a] placeholder-[#14161a]/40 focus:outline-none focus:border-[#14161a] transition';

const buttonClass =
  'inline-block px-8 py-3.5 bg-[#14161a] text-[#F2F0EB] text-[10px] uppercase tracking-[0.32em] hover:bg-[#A1543E] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A1543E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2F0EB]';

const textLinkClass =
  'text-[#14161a] font-medium underline underline-offset-2 hover:text-[#A1543E] transition-colors';

export default function LoginPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [emailOptIn, setEmailOptIn] = useState(false);
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        setError('Invalid email or password');
      } else {
        setError(result.error);
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, emailOptIn }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Signup failed');
        return;
      }

      signIn('credentials', {
        redirect: true,
        email,
        password,
        callbackUrl: `/?welcomeName=${encodeURIComponent(name)}`,
      });
    } catch {
      setError('Something went wrong during signup');
    }
  };

  if (status === 'loading') return null;

  if (session) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#F2F0EB] px-6 text-[#14161a] relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="z-10 flex flex-col items-center max-w-xl px-4 pt-20"
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#14161a]/45 mb-5">
            Welcome Back
          </p>

          <h1 className="text-[28px] md:text-[40px] font-semibold uppercase tracking-[0.18em] mb-4 text-center leading-tight">
            {session.user?.name?.trim()
              ? session.user.name
              : session.user?.email?.split('@')[0]}
          </h1>

          <p className="mb-8 max-w-lg text-center text-[#14161a]/60 text-[13px] uppercase tracking-[0.3em]">
            Unryvoled Pursuit<span className="text-[#A1543E]">.</span>
          </p>

          <button onClick={() => signOut()} className={`${buttonClass} mb-14`}>
            Sign Out
          </button>

          <div className="w-full text-center px-4">
            <h2 className="text-[13px] uppercase tracking-[0.3em] text-[#14161a]/60 mb-6">
              First access to drops
            </h2>
            <Newsletter />

            <div className="mt-10">
              <h3 className="text-[11px] uppercase tracking-[0.3em] text-[#14161a]/60 mb-4">
                Follow the Pursuit
              </h3>
              <div className="flex justify-center gap-8 text-[#14161a] text-2xl">
                <a
                  href="https://www.instagram.com/shopryvol" // TODO: confirm handle
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#A1543E] transition"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://www.tiktok.com/@shopryvol" // TODO: confirm handle
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#A1543E] transition"
                  aria-label="TikTok"
                >
                  <FaTiktok />
                </a>
              </div>
            </div>

            <div className="mt-14">
              <Link href="/" className={textLinkClass}>
                Back to homepage
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start sm:justify-center bg-[#F2F0EB] px-6 text-[#14161a] pt-10 sm:pt-0 relative">
      <h1 className="text-[26px] md:text-[34px] font-semibold uppercase tracking-[0.2em] mb-8 mt-10 sm:mt-0">
        {mode === 'signin' ? 'Sign In' : 'Sign Up'}
      </h1>

      <form
        onSubmit={mode === 'signin' ? handleSignIn : handleSignUp}
        className="flex flex-col gap-5 w-full max-w-sm"
      >
        {mode === 'signup' && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputClass}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={inputClass}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={inputClass}
        />

        {mode === 'signin' && (
          <button
            type="button"
            onClick={() => router.push('/reset-password')}
            className={`${textLinkClass} text-sm text-left mb-1`}
          >
            Forgot password?
          </button>
        )}

        <button type="submit" className={`${buttonClass} mt-2`}>
          {mode === 'signin' ? 'Log In' : 'Create Account'}
        </button>

        {mode === 'signup' && (
          <label className="mt-3 flex items-center gap-3 text-[#14161a]/70 text-sm select-none cursor-pointer">
            <input
              type="checkbox"
              checked={emailOptIn}
              onChange={(e) => setEmailOptIn(e.target.checked)}
              className="w-5 h-5 border-[#14161a]/30 accent-[#14161a]"
            />
            <span>Send me drop alerts and restocks.</span>
          </label>
        )}
      </form>

      {error && (
        <p className="mt-4 text-center text-[#A1543E] font-medium text-sm">{error}</p>
      )}

      <div className="mt-6 text-center text-sm text-[#14161a]/70">
        {mode === 'signin' ? (
          <>
            Don&apos;t have an account?{' '}
            <button
              onClick={() => {
                setError('');
                setMode('signup');
              }}
              className={textLinkClass}
            >
              Sign Up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              onClick={() => {
                setError('');
                setMode('signin');
              }}
              className={textLinkClass}
            >
              Sign In
            </button>
          </>
        )}
      </div>

      <div className="mt-14 text-center">
        <Link href="/" className={textLinkClass}>
          Back to homepage
        </Link>

        
      </div>
    </div>
  );
}
