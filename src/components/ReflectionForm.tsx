'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ReflectionForm({ shirtCode }: { shirtCode: string }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return toast.error('Reflection cannot be empty');

    setLoading(true);

    const res = await fetch(`/api/reflections/${shirtCode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shirtCode, text }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || 'Something went wrong');
    } else {
      toast.success(data.message || 'Reflection submitted!');
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border p-2 rounded mb-2"
        placeholder="Share your reflection (max 150 characters)"
        maxLength={150}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        {loading ? 'Submitting...' : 'Submit Reflection'}
      </button>
    </form>
  );
}
