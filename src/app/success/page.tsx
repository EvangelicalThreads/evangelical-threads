// src/app/success/page.tsx
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="max-w-4xl mx-auto p-8 text-center">
      <h1 className="text-4xl font-bold mb-6">Payment Successful!</h1>
      <p className="mb-6">Thank you for your purchase. Your order is being processed.</p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition"
      >
        Back to Home
      </Link>
    </main>
  );
}
