'use client';

import { useEffect, useState } from 'react';

interface Reflection {
  id: string;
  text: string;
  created_at: string;
  shirt_code: string;
  is_approved: boolean;
}

export default function AdminReflectionsPage() {
  const [reflections, setReflections] = useState<Reflection[]>([]);

  useEffect(() => {
    const fetchReflections = async () => {
      try {
        const res = await fetch('/api/admin/reflections');
        const data = await res.json();
        setReflections(data.reflections || []);
      } catch (error) {
        console.error('Error fetching reflections:', error);
      }
    };

    fetchReflections();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await fetch('/api/admin/reflections/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      await refreshReflections();
    } catch (error) {
      console.error('Error approving reflection:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch('/api/admin/reflections/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      await refreshReflections();
    } catch (error) {
      console.error('Error deleting reflection:', error);
    }
  };

  const refreshReflections = async () => {
    try {
      const res = await fetch('/api/admin/reflections');
      const data = await res.json();
      setReflections(data.reflections || []);
    } catch (error) {
      console.error('Error refreshing reflections:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin: Review Reflections</h1>
      {reflections.length === 0 ? (
        <p className="text-gray-600">No reflections available.</p>
      ) : (
        reflections.map((reflection) => (
          <div key={reflection.id} className="border p-4 mb-4 rounded shadow">
            <p className="text-sm mb-2">{reflection.text}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(reflection.id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => handleDelete(reflection.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
