"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { trackPixelEvent } from "@/lib/metaPixel";

export default function SuccessPage() {
  const { cart, total, clearCart } = useCart();

  useEffect(() => {
    // Read the cart and fire Purchase BEFORE clearing it — the order that
    // was just paid for is still sitting in state at this point. The
    // event_id mirrors what the Stripe webhook sends server-side via the
    // Conversions API (`purchase_<stripe session id>`), so Meta dedupes
    // the browser and server copies of the same sale into one conversion
    // instead of double-counting it.
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    trackPixelEvent(
      "Purchase",
      {
        value: total,
        currency: "USD",
        content_ids: cart.map((item) => item.id),
        content_type: "product",
        contents: cart.map((item) => ({ id: item.id, quantity: item.quantity })),
      },
      sessionId ? `purchase_${sessionId}` : undefined
    );

    clearCart();
    // Runs once on mount only — cart/total are read from state at that
    // moment, not tracked as effect deps (clearCart would immediately
    // invalidate them anyway).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          Thank you for your purchase. A confirmation is on its way, and the
          current begins shortly.
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
