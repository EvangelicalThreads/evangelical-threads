'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setMessage(data.message || 'If your email is registered, a reset link has been sent.');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Unexpected error');
      } else {
        setError('Unexpected error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-6 py-12 bg-white">
      <h1 className="text-4xl font-semibold mb-6">Reset Your Password</h1>

      <form onSubmit={handleReset} className="w-full max-w-sm flex flex-col gap-4">
        <input
          type="email"
          placeholder="Enter your email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-[#D4AF37] text-white rounded px-4 py-3 font-semibold hover:bg-yellow-500 transition"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      <button
        onClick={() => router.push('/login')}
        className="mt-8 text-[#D4AF37] underline hover:text-yellow-500"
      >
        Back to Login
      </button>
    </main>
  );
}
