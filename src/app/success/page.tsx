"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="max-w-4xl mx-auto p-8 text-center">
      <h1 className="text-4xl font-bold mb-6">Payment Successful!</h1>
      <p className="mb-6">
        Thank you for your purchase. Your order is being processed.
      </p>

      <Link
        href="/"
        className="inline-block px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition"
      >
        Back to Home
      </Link>
    </main>
  );
}