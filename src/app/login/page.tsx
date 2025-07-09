'use client';

import { useState } from 'react';
import { signIn, signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Newsletter from '@/components/Newsletter';
import { useRouter } from 'next/navigation';

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

      // Send them to homepage with scroll verse name
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
      <div className="min-h-screen flex flex-col justify-center items-center bg-white px-6 text-gray-900 relative overflow-hidden">
        <div className="absolute top-[-120px] left-[-120px] w-80 h-80 bg-gradient-to-tr from-[#D4AF37]/20 via-transparent to-transparent rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-[-100px] right-[-100px] w-72 h-72 bg-gradient-to-bl from-[#D4AF37]/15 via-transparent to-transparent rounded-full filter blur-2xl animate-pulse animation-delay-2000" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="z-10 flex flex-col items-center max-w-xl px-4 pt-20"
        >
          <h1 className="text-5xl font-serif font-extrabold mb-4 text-center tracking-tight leading-tight text-gray-900">
            Welcome Back
          </h1>

          <h2 className="text-4xl font-serif font-semibold mb-4 text-center text-[#D4AF37] tracking-tight">
            {session.user?.name?.trim()
              ? `${session.user.name} 👋`
              : session.user?.email?.split('@')[0]}
          </h2>

          <p className="mb-8 max-w-lg text-center text-gray-700 text-lg font-light">
            You are the light of the world ✨
          </p>

          <button
            onClick={() => signOut()}
            className="inline-block mt-6 px-6 py-3 border border-[#D4AF37] text-[#D4AF37] rounded hover:bg-[#D4AF37] hover:text-white transition font-semibold shadow-md mb-14 focus:outline-none focus:ring-4 focus:ring-yellow-400"
          >
            Sign Out
          </button>

          <div className="w-full text-center px-4">
            <h2 className="text-2xl font-serif font-semibold mb-6 tracking-wide text-gray-900">
              Join the community below if you haven’t yet
            </h2>
            <Newsletter />

            <div className="mt-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow us</h3>
              <div className="flex justify-center gap-10 text-gray-900 text-3xl">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#D4AF37] transition">
                  <FaInstagram />
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-[#D4AF37] transition">
                  <FaTiktok />
                </a>
              </div>
            </div>

            <div className="mt-14">
              <a href="/" className="text-[#D4AF37] font-semibold underline hover:text-[#b8932f] transition-colors">
                Go back to homepage
              </a>
            </div>
          </div>
        </motion.div>

        <div className="mt-20 w-28 h-1 bg-gradient-to-r from-[#D4AF37] via-[#bfa235] to-[#D4AF37] rounded-full opacity-60" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-6 text-gray-900 relative">
      <h1 className="text-4xl font-serif font-extrabold pt-20 mb-2">
        {mode === 'signin' ? 'Sign In' : 'Sign Up'}
      </h1>

      <form
        onSubmit={mode === 'signin' ? handleSignIn : handleSignUp}
        className="flex flex-col gap-5 w-full max-w-sm"
      >
        {mode === 'signup' && (
          <input
            type="text"
            placeholder="What would you like to be called?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border border-gray-300 rounded-md px-5 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-gray-300 rounded-md px-5 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border border-gray-300 rounded-md px-5 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition"
        />

        {mode === 'signin' && (
          <button
            type="button"
            onClick={() => router.push('/reset-password')}
            className="text-sm text-[#D4AF37] font-semibold underline mb-2 hover:text-[#b8932f] transition-colors text-left"
          >
            Forgot password?
          </button>
        )}

        <button
          type="submit"
          className="inline-block mt-2 px-6 py-3 border border-[#D4AF37] text-[#D4AF37] rounded hover:bg-[#D4AF37] hover:text-white transition font-semibold shadow-md focus:outline-none focus:ring-4 focus:ring-yellow-400"
        >
          {mode === 'signin' ? 'Log In' : 'Show my verse'}
        </button>

        {mode === 'signup' && (
          <label className="mt-3 flex items-center gap-3 text-gray-700 text-sm select-none cursor-pointer">
            <input
              type="checkbox"
              checked={emailOptIn}
              onChange={(e) => setEmailOptIn(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 focus:ring-[#D4AF37] focus:ring-2"
            />
            <span>I want to receive email updates and newsletters.</span>
          </label>
        )}
      </form>

      {error && <p className="mt-4 text-center text-red-600 font-semibold">{error}</p>}

      <div className="mt-6 text-center">
        {mode === 'signin' ? (
          <>
            Don't have an account?{' '}
            <button
              onClick={() => {
                setError('');
                setMode('signup');
              }}
              className="text-[#D4AF37] font-semibold underline hover:text-[#b8932f] transition-colors"
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
              className="text-[#D4AF37] font-semibold underline hover:text-[#b8932f] transition-colors"
            >
              Sign In
            </button>
          </>
        )}
      </div>

      <div className="mt-14 text-center">
        <a
          href="/"
          className="text-[#D4AF37] font-semibold underline hover:text-[#b8932f] transition-colors"
        >
          Go back to homepage
        </a>
      </div>
    </div>
  );
}
