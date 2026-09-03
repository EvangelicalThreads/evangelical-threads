'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function AdminLoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const next = searchParams.get('next') || '/admin';
        router.push(next);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Incorrect password');
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        autoFocus
        className="w-full px-4 py-3 border border-[#14161a]/25 bg-transparent text-[#14161a] placeholder:text-[#14161a]/35 focus:outline-none focus:border-[#14161a] transition"
      />
      {error && <p className="text-[12px] text-[var(--rv-navy)]">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 border border-[#14161a] text-[#14161a] uppercase tracking-[0.24em] text-[11px] hover:bg-[#14161a] hover:text-[#F2F0EB] transition disabled:opacity-50"
      >
        {loading ? 'Checking…' : 'Enter'}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F2F0EB] text-[#14161a] px-6">
      <div className="w-full max-w-sm">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#14161a]/40 text-center mb-4">
          RYVOL
        </p>
        <h1 className="rv-serif italic text-[28px] text-center mb-8">Admin</h1>
        <Suspense fallback={null}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </main>
  );
}
