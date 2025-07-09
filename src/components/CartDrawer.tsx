"use client";

import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    toggleCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    total,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <aside className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 p-6 flex flex-col">
      <button
        onClick={toggleCart}
        className="self-end mb-4 text-gray-700 hover:text-black"
        aria-label="Close Cart"
      >
        ✕
      </button>

      <h2 className="text-xl font-bold mb-4">Your Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <ul className="flex-1 overflow-auto space-y-4">
            {cart.map(({ id, name, price, quantity, image }) => (
              <li key={id} className="flex items-center space-x-4">
                <img src={image} alt={name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-semibold">{name}</p>
                  <p>${price.toFixed(2)}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <button
                      onClick={() => decreaseQty(id)}
                      className="bg-gray-200 px-2 rounded"
                      aria-label={`Decrease quantity of ${name}`}
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() => increaseQty(id)}
                      className="bg-gray-200 px-2 rounded"
                      aria-label={`Increase quantity of ${name}`}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(id)}
aria-label={`Remove ${name} from cart`}
className="cursor-pointer bg-gray-200 text-black px-3 py-1 rounded hover:bg-gray-300 transition font-semibold shadow-sm hover:underline"
>
  ×
</button>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t pt-4 flex justify-between items-center font-semibold text-lg">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

        <button
  onClick={async () => {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartItems: cart }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Something went wrong. Try again!");
    }
  }}
  className="mt-6 bg-black text-white py-3 rounded hover:opacity-90 transition"
>
  Checkout
</button>

        </>
      )}
    </aside>
  );
}
