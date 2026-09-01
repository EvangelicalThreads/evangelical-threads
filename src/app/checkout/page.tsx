"use client";

import { useState } from "react";
import { useCart } from "../../context/CartContext";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
  const { cart, removeFromCart, increaseQty, decreaseQty, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function handleCheckout() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: cart }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Failed to redirect to Stripe.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (cart.length === 0) {
    return (
      <main className="bg-[#F2F0EB] min-h-screen text-[#14161a]">
        <div className="max-w-[560px] mx-auto px-6 pt-32 pb-28 text-center">
          <p className="rv-serif italic text-[30px] md:text-[36px] text-[#14161a] mb-4">
            Your cart is empty.
          </p>
          <p className="text-[13px] text-[#14161a]/55 mb-10">
            Add something from the drop to get started.
          </p>
          <Link
            href="/shop"
            className="inline-block px-9 py-3.5 border border-[#14161a] text-[11px] uppercase tracking-[0.24em] text-[#14161a] hover:bg-[#14161a] hover:text-[#F2F0EB] transition"
          >
            Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F2F0EB] min-h-screen text-[#14161a]">
      <div className="max-w-[820px] mx-auto px-6 md:px-10 pt-24 pb-28 md:pt-32">
        <p className="rv-serif italic text-center text-[36px] md:text-[44px] leading-[1.1] text-[#14161a] mb-16 md:mb-20">
          Checkout
        </p>

        <ul className="divide-y divide-[#14161a]/8">
          {cart.map((item) => (
            <li
              key={`${item.id}-${item.size}`}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-[#EDEAE3]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="rv-serif italic text-[17px] text-[#14161a] truncate">
                    {item.name}
                  </p>
                  {item.size && (
                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-[#14161a]/45">
                      Size: {item.size}
                    </p>
                  )}
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#14161a]/45">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="flex items-center gap-3 text-[13px] text-[#14161a]">
                  <button
                    onClick={() => decreaseQty(item.id, item.size)}
                    className="w-3 text-[#14161a]/50 transition hover:text-[#14161a]"
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    −
                  </button>
                  <span className="w-3 text-center">{item.quantity}</span>
                  <button
                    onClick={() => increaseQty(item.id, item.size)}
                    className="w-3 text-[#14161a]/50 transition hover:text-[#14161a]"
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id, item.size)}
                  className="text-[10px] uppercase tracking-[0.14em] text-[#14161a]/40 transition hover:text-[var(--rv-navy)] whitespace-nowrap"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex items-baseline justify-between border-t border-[#14161a]/10 mt-2 pt-6">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#14161a]/50">
            Total
          </span>
          <span className="rv-serif italic text-[24px] text-[#14161a]">
            ${total.toFixed(2)}
          </span>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <button
            onClick={handleCheckout}
            disabled={loading || cart.length === 0}
            className="w-full max-w-sm px-9 py-4 bg-[#14161a] text-[11px] uppercase tracking-[0.24em] text-[#F2F0EB] transition hover:bg-[var(--rv-navy)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Processing…" : "Checkout"}
          </button>

          {error && (
            <p className="text-[12px] text-[var(--rv-navy)]">{error}</p>
          )}

          <div className="flex items-center gap-8 mt-2">
            <Link
              href="/shop"
              className="text-[11px] uppercase tracking-[0.2em] text-[#14161a]/55 border-b border-[#14161a]/25 pb-0.5 hover:text-[#14161a] hover:border-[#14161a] transition"
            >
              Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-[11px] uppercase tracking-[0.2em] text-[#14161a]/40 border-b border-[#14161a]/20 pb-0.5 hover:text-[var(--rv-navy)] hover:border-[var(--rv-navy)] transition"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
