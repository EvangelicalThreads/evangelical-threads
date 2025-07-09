'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Pull query params after hydration
  useEffect(() => {
    const urlToken = searchParams.get('token');
    const urlEmail = searchParams.get('email');
    if (urlToken && urlEmail) {
      setToken(urlToken);
      setEmail(urlEmail);
    } else {
      setError('Invalid or missing reset link.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setMessage('Password updated! Redirecting to login...');
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Unexpected error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-6 py-12 bg-white">
      <h1 className="text-4xl font-semibold mb-6">Set New Password</h1>

      {error && <p className="mb-4 text-red-600">{error}</p>}
      {message && <p className="mb-4 text-green-600">{message}</p>}

      {!message && (
        <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
          <input
            type="password"
            placeholder="New Password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#D4AF37] text-white rounded px-4 py-3 font-semibold hover:bg-yellow-500 transition"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}
    </main>
  );
}
