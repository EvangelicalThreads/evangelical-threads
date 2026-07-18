'use client';
import React, { useState } from 'react';

export default function Newsletter({ showHeading = true }: { showHeading?: boolean }) {
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
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="mt-20 mb-6 px-6 text-center">
      {showHeading && (
        <>
          <h2 className="text-xl font-bold uppercase tracking-[0.08em] mb-2 text-neutral-900">
            Be First
          </h2>
          <p className="text-neutral-500 mb-6 text-sm">
            Limited quantities. Join the list before the first drop.
          </p>
        </>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-stretch justify-center gap-3 max-w-md mx-auto"
      >
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-3 border border-neutral-900 rounded-none bg-transparent text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          required
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-8 py-3 bg-neutral-900 text-[#f4f1ea] rounded-none uppercase tracking-[0.12em] text-sm hover:bg-neutral-700 transition disabled:opacity-50 whitespace-nowrap"
        >
          {status === 'loading' ? 'Joining…' : 'Subscribe'}
        </button>
      </form>

      {status === 'success' && (
        <p className="mt-4 text-neutral-900 text-sm uppercase tracking-[0.08em]">
          You&rsquo;re in.
        </p>
      )}
      {status === 'error' && (
        <p className="mt-4 text-[#a3512b] text-sm">
          Something went wrong. Try again.
        </p>
      )}
    </div>
  );
}