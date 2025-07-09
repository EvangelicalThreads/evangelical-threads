'use client';

import { useState, useEffect } from 'react';

export default function LikeButton({ reflectionId }: { reflectionId: string }) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchStatus() {
      const res = await fetch(`/api/likes/status?id=${reflectionId}`);
      const data = await res.json();
      if (res.ok) {
        setLiked(data.liked);
      }
    }

    fetchStatus();
  }, [reflectionId]);

  async function toggleLike() {
    if (loading) return;
    setLoading(true);

    const res = await fetch('/api/likes/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reflectionId }),
    });

    const data = await res.json();
    if (res.ok) {
      setLiked(data.liked);
    }

    setLoading(false);
  }

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      aria-pressed={liked}
      aria-label="Like button"
      className="text-2xl transition-colors duration-200"
      style={{ color: liked ? 'hotpink' : 'gray' }}
    >
      ❤️
    </button>
  );
}
