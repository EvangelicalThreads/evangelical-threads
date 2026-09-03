'use client';
import React, { useState } from 'react';

export default function Newsletter({
  showHeading = true,
  align = 'center',
  compact = false,
}: {
  showHeading?: boolean;
  align?: 'center' | 'left';
  compact?: boolean;
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const isLeft = align === 'left';

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
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className={`${compact ? 'mt-0' : 'mt-20'} mb-6 px-6 ${isLeft ? 'text-left' : 'text-center'}`}>
      {showHeading && (
        <>
          <h2 className="rv-serif italic text-[26px] md:text-[30px] mb-3 text-[#14161a]">
            The Current
          </h2>
          <p className="text-[#14161a]/50 mb-8 text-[12px] uppercase tracking-[0.18em]">
            Sign up for 10% off your first order. Occasional word after that.
          </p>
        </>
      )}
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col sm:flex-row items-stretch gap-3 max-w-md ${isLeft ? '' : 'justify-center mx-auto'}`}
      >
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="w-full px-4 py-3 border border-[#14161a]/25 rounded-none bg-transparent text-[#14161a] placeholder:text-[#14161a]/35 focus:outline-none focus:border-[#14161a] transition"
          required
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-8 py-3 border border-[#14161a] text-[#14161a] rounded-none uppercase tracking-[0.24em] text-[11px] hover:bg-[#14161a] hover:text-[#F2F0EB] transition disabled:opacity-50 whitespace-nowrap"
        >
          {status === 'loading' ? 'Joining…' : 'Join'}
        </button>
      </form>

      {status === 'success' && (
        <p className="mt-4 text-[#14161a] text-[11px] uppercase tracking-[0.18em]">
          You&rsquo;re on the list. Check your email for your code.
        </p>
      )}
      {status === 'error' && (
        <p className="mt-4 text-[var(--rv-navy)] text-sm">
          Something went wrong. Try again.
        </p>
      )}
    </div>
  );
}