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

  const fetchReflections = async () => {
    const res = await fetch('/api/admin/reflections');
    const data = await res.json();
    setReflections(data.reflections || []);
  };

  useEffect(() => {
    fetchReflections();
  }, []);

  const handleApprove = async (id: string) => {
    await fetch(`/api/admin/reflections/approve`, {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
    fetchReflections();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/reflections/delete`, {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
    fetchReflections();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin: Review Reflections</h1>
      {reflections.map((reflection) => (
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
      ))}
    </div>
  );
}
