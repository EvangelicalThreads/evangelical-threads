"use client";

import { useCart } from "../../context/CartContext";

export default function CheckoutPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <main className="max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Cart is Empty</h1>
        <p>Add some products from the shop to get started.</p>
        <a
          href="/shop"
          className="inline-block mt-6 px-6 py-3 border border-[#D4AF37] text-[#D4AF37] rounded hover:bg-[#D4AF37] hover:text-white transition font-semibold shadow-md"
        >
          Continue Shopping
        </a>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>
      <ul>
        {cartItems.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between mb-4 border-b pb-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p>${item.price}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.id, parseInt(e.target.value, 10))
                }
                className="w-16 border rounded px-2 py-1 ml-2 sm:ml-0"
              />
              <button
                onClick={() => removeFromCart(item.id)}
                className="cursor-pointer inline-block bg-gray-200 text-black px-3 py-1 rounded hover:bg-gray-300 transition font-semibold shadow-sm hover:underline"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="text-right font-bold text-xl mt-8">
        Total: ${total.toFixed(2)}
      </div>

    <button
  onClick={async () => {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Failed to redirect to Stripe.");
    }
  }}

        className="mt-6 bg-white text-black border border-black px-6 py-3 rounded hover:bg-gray-100 transition font-semibold shadow-sm"
      >
        Checkout
      </button>

      <button
        onClick={clearCart}
        className="mt-2 ml-4 bg-gray-200 text-black px-6 py-3 rounded hover:bg-gray-300 transition font-semibold shadow-sm"
      >
        Clear Cart
      </button>

      <div className="mt-6">
        <a
          href="/shop"
          className="inline-block mt-6 px-6 py-3 border border-[#D4AF37] text-[#D4AF37] rounded hover:bg-[#D4AF37] hover:text-white transition font-semibold shadow-md"
        >
          Continue Shopping
        </a>
      </div>
    </main>
  );
}
