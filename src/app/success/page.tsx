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
    <main className="bg-[#F2F0EB] min-h-screen text-[#14161a] flex items-center">
      <div className="max-w-[560px] mx-auto px-6 py-32 text-center">
        <img
          src="/brand/ryvol-emblem-navy.png"
          alt="RYVOL"
          className="w-11 h-11 mx-auto mb-10"
        />
        <p className="rv-serif italic text-[34px] md:text-[42px] leading-[1.1] text-[#14161a] mb-5">
          Order Confirmed.
        </p>
        <p className="text-[13px] leading-[1.8] text-[#14161a]/60 mb-12 max-w-[380px] mx-auto">
          Thank you for your purchase. A confirmation is on its way — your
          pursuit begins shortly.
        </p>
        <Link
          href="/"
          className="inline-block px-9 py-3.5 border border-[#14161a] text-[11px] uppercase tracking-[0.24em] text-[#14161a] hover:bg-[#14161a] hover:text-[#F2F0EB] transition"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
