'use client';

import Link from 'next/link';

export default function AdminPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="text-lg text-gray-700 mb-4">
        Welcome to the admin dashboard. Use the links below to manage site content.
      </p>
      <div className="flex flex-col gap-4">
        <Link
          href="/admin/reflections"
          className="inline-block px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          Review Reflections
        </Link>
        {/* Add more admin links as needed */}
      </div>
    </main>
  );
}
