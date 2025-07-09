'use client';

import { useEffect, useState } from 'react';

interface Reflection {
  id: string;
  text: string;
  created_at: string;
}

interface ReflectionFeedProps {
  shirtCode: string;
}

export default function ReflectionFeed({ shirtCode }: ReflectionFeedProps) {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchReflections() {
    setLoading(true);
    try {
      const res = await fetch(`/api/reflections/${shirtCode}`);
      const data = await res.json();
      setReflections(data.reflections || []);
    } catch {
      // Handle errors silently or show message if you want
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReflections();

    const interval = setInterval(fetchReflections, 10000); // refresh every 10 seconds
    return () => clearInterval(interval);
  }, [shirtCode]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reflections</h2>
      {loading && <p>Loading reflections...</p>}
      {!loading && reflections.length === 0 && <p>No reflections yet. Be the first!</p>}
      <ul className="space-y-3">
        {reflections.map(({ id, text, created_at }) => (
          <li key={id} className="p-3 border rounded bg-gray-50">
            <p>{text}</p>
            <small className="text-gray-400">
              {new Date(created_at).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
