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
      <main className="max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Cart is Empty</h1>
        <p>Add some products from the shop to get started.</p>
        <Link
          href="/shop"
          className="inline-block mt-6 px-6 py-3 border border-[#D4AF37] text-[#D4AF37] rounded hover:bg-[#D4AF37] hover:text-white transition font-semibold shadow-md"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>
      <ul>
        {cart.map((item) => (
          <li
            key={`${item.id}-${item.size}`}
            className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b pb-6 gap-4"
          >
            {/* Left side: image and details */}
            <div className="flex items-center gap-4">
              <Image
                src={item.image}
                alt={item.name}
                width={80}
                height={80}
                className="object-cover rounded"
              />
              <div className="min-w-0">
                <h2 className="font-semibold truncate">{item.name}</h2>
                {item.size && (
                  <p className="text-sm text-gray-500">Size: {item.size}</p>
                )}
                <p>${item.price.toFixed(2)}</p>
              </div>
            </div>

            {/* Right side: quantity controls and remove */}
            <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
              <div className="flex items-center gap-2 border rounded overflow-hidden">
                <button
                  onClick={() => decreaseQty(item.id, item.size)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition"
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  −
                </button>
                <span className="px-3 py-1">{item.quantity}</span>
                <button
                  onClick={() => increaseQty(item.id, item.size)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition"
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.id, item.size)}
                className="cursor-pointer bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 transition font-semibold shadow-sm whitespace-nowrap"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="text-right font-bold text-xl mt-8">Total: ${total.toFixed(2)}</div>

      <button
        onClick={handleCheckout}
        disabled={loading || cart.length === 0}
        className="mt-6 bg-white text-black border border-black px-6 py-3 rounded hover:bg-gray-100 transition font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Checkout"}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      <button
        onClick={clearCart}
        className="mt-2 ml-4 bg-gray-200 text-black px-6 py-3 rounded hover:bg-gray-300 transition font-semibold shadow-sm"
      >
        Clear Cart
      </button>

      <div className="mt-6">
        <Link
          href="/shop"
          className="inline-block mt-6 px-6 py-3 border border-[#D4AF37] text-[#D4AF37] rounded hover:bg-[#D4AF37] hover:text-white transition font-semibold shadow-md"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
