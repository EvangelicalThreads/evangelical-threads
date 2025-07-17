"use client";

import React from "react";
import { useCart } from "../context/CartContext";
import Image from "next/image";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    total,
    clearCart,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end"
      onClick={closeCart}
    >
      <div
        className="bg-white w-96 max-w-full h-full p-6 overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

        {cart.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty</p>
        ) : (
          <>
            <ul>
              {cart.map((item) => (
                <li
                  key={`${item.id}-${item.size || "default"}`}
                  className="flex items-center justify-between mb-6"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded object-cover"
                    />
                    <div>
                      <p className="font-semibold">
                        {item.name} {item.size && `(Size: ${item.size})`}
                      </p>
                      <p className="text-gray-600">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => decreaseQty(item.id, item.size)}
                          className="px-2 py-1 border rounded hover:bg-gray-200"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => increaseQty(item.id, item.size)}
                          className="px-2 py-1 border rounded hover:bg-gray-200"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="text-red-500 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="border-t pt-4 mt-4 flex justify-between items-center font-bold text-lg">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={clearCart}
                className="flex-grow bg-red-600 text-white py-3 rounded hover:bg-red-700 transition"
              >
                Clear Cart
              </button>
              <button
                onClick={closeCart}
                className="flex-grow bg-gray-300 py-3 rounded hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
