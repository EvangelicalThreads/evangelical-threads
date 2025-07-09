"use client";

import React, { useState } from "react";
import "./globals.css";
import Navbar from "../components/Navbar";
import { CartProvider, useCart } from "../context/CartContext";
import { SessionProvider } from "next-auth/react";
import { Toaster } from 'react-hot-toast';


   (
    <html>
      <body>
        <Toaster position="top-center" />
      </body>
    </html>
  );


import ScrollPopup from "../components/ScrollPopup";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);

  // Popup state
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [scrollVisible, setScrollVisible] = useState(false);
  const [userName, setUserName] = useState("");

  const toggleCartOpen = () => setCartOpen((open) => !open);

  // Called when user submits their name in WelcomePopup
  const handleWelcomeSubmit = (name: string) => {
    setUserName(name);
    setWelcomeVisible(false);
    setScrollVisible(true);
  };

  // Called when user closes ScrollPopup
  const handleScrollClose = () => {
    setScrollVisible(false);
  };

  return (
    <html lang="en">
      <body className="relative z-0">
        <SessionProvider>
          <CartProvider>
            <Navbar toggleCartOpen={toggleCartOpen} />
            {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}

            {/* POPUPS */}
            <ScrollPopup
              isVisible={scrollVisible}
              onClose={handleScrollClose}
              verseText={`Hey ${userName}, you are the light of the world.`}
            />

            {children}
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

function CartDrawer({ onClose }: { onClose: () => void }) {
  const { cartItems, total, removeFromCart, updateQuantity, clearCart } = useCart();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end" onClick={onClose}>
      <div
        className="bg-white w-80 h-full p-4 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Your Cart</h2>

        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <ul className="overflow-y-auto max-h-[70vh]">
            {cartItems.map((item) => (
              <li key={`${item.id}-${item.size || ""}`} className="mb-3 flex items-center justify-between">
                <div>
                  <p>
                    {item.name} {item.size && `(Size: ${item.size})`}
                  </p>
                  <p>
                    ${item.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="font-bold mt-4">Total: ${total.toFixed(2)}</p>

        <button onClick={clearCart} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
          Clear Cart
        </button>

        <button onClick={onClose} className="mt-4 bg-gray-300 px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
}
