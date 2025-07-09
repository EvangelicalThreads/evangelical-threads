"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect, useMemo } from "react";
import { useCart } from "../context/CartContext";
import { ShoppingCart, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const cartIconRef = useRef(null);
  const cartDropdownRef = useRef(null);
  const menuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        cartDropdownRef.current &&
        !cartDropdownRef.current.contains(event.target) &&
        cartIconRef.current &&
        !cartIconRef.current.contains(event.target)
      ) {
        setCartOpen(false);
      }
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !(event.target as HTMLElement).closest('[aria-label="Toggle menu"]')
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-2 md:px-4">
        <Link href="/" className="flex items-center space-x-1 min-w-0">
          <Image
            src="/logo-nav.svg"
            alt="Evangelical Threads Logo"
            width={50}
            height={45}
            className="object-contain"
            draggable={false}
          />
          <span className="text-sm md:text-base font-bold whitespace-nowrap truncate" style={{ minWidth: 0 }}>
            Evangelical Threads
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/shop" className="hover:underline">Shop</Link>
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/reviews" className="hover:underline">Reviews</Link>
          <Link href="/checkout" className="block py-1 hover:underline font-semibold">Checkout</Link>
          <Link href="/login" className="hover:underline flex items-center">
            <User className="w-5 h-5" />
          </Link>
          <div className="relative">
            <button
              aria-label="Toggle cart"
              onClick={() => setCartOpen(!cartOpen)}
              ref={cartIconRef}
              className="relative p-2"
            >
              <ShoppingCart className="w-6 h-6 text-black" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex md:hidden items-center space-x-2">
          <Link href="/login" className="p-1" aria-label="Login">
            <User className="w-5 h-5" />
          </Link>
          <button
            aria-label="Toggle cart"
            onClick={() => setCartOpen(!cartOpen)}
            ref={cartIconRef}
            className="relative p-1"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-semibold">
                {totalCount}
              </span>
            )}
          </button>
          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Desktop Cart Dropdown */}
{cartOpen && (
  <div
    ref={cartDropdownRef}
    className="hidden md:block absolute right-2 md:right-4 mt-2 w-72 sm:w-96 bg-white border rounded-lg shadow-lg p-4 z-50"
  >
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">Your Cart</h3>
      <button
        onClick={() => setCartOpen(false)}
        className="text-xl font-bold text-gray-600 hover:text-black"
        aria-label="Close cart"
      >
        ×
      </button>
    </div>
          {cartItems.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-500">Your cart is empty.</p>
              <button
                onClick={() => {
                  setCartOpen(false);
                  router.push("/shop");
                }}
                className="inline-block mt-4 px-6 py-2 border border-[#D4AF37] text-[#D4AF37] rounded hover:bg-[#D4AF37] hover:text-white transition font-semibold shadow-md"
              >
                Go Shopping
              </button>
            </div>
          ) : (
            <>
              <ul className="max-h-60 overflow-y-auto">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex items-center justify-between mb-4 border-b pb-2">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center ml-4">
                      <button onClick={() => updateQuantity(item.id, Math.max(item.quantity - 1, 1))} className="px-2 py-1 text-sm bg-gray-200 rounded">−</button>
                      <span className="px-2">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-sm bg-gray-200 rounded">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="bg-gray-200 text-black px-3 py-1 rounded hover:bg-gray-300 transition font-semibold text-sm shadow-sm ml-2">Remove</button>
                  </li>
                ))}
              </ul>
              <div className="text-right font-bold text-lg mt-4">Subtotal: ${subtotal.toFixed(2)}</div>
              <button onClick={() => { setCartOpen(false); router.push("/checkout"); }} className="block border border-black text-black text-center py-2 px-4 rounded mt-4 hover:bg-black hover:text-white transition">Go to Checkout</button>
              <button onClick={() => { setCartOpen(false); router.push("/shop"); }} className="block w-full mt-2 px-6 py-3 border border-[#D4AF37] text-[#D4AF37] rounded hover:bg-[#D4AF37] hover:text-white transition font-semibold shadow-md text-center">Keep Shopping</button>
            </>
          )}
        </div>
      )}

      {/* Mobile Cart Slide-Out */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div ref={cartDropdownRef} className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Your Cart</h3>
            <button onClick={() => setCartOpen(false)} className="text-xl font-bold text-gray-600">×</button>
          </div>
          {cartItems.length === 0 ? (
            <div className="text-center mt-10">
              <p className="text-gray-500">Your cart is empty.</p>
              <button
                onClick={() => {
                  setCartOpen(false);
                  router.push("/shop");
                }}
                className="inline-block mt-4 px-6 py-2 border border-[#D4AF37] text-[#D4AF37] rounded hover:bg-[#D4AF37] hover:text-white transition font-semibold shadow-md"
              >
                Go Shopping
              </button>
            </div>
          ) : (
            <>
              <ul className="max-h-[50vh] overflow-y-auto">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex items-center justify-between mb-4 border-b pb-2">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.quantity} × ${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center ml-4">
                      <button onClick={() => updateQuantity(item.id, Math.max(item.quantity - 1, 1))} className="px-2 py-1 text-sm bg-gray-200 rounded">−</button>
                      <span className="px-2">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-sm bg-gray-200 rounded">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="bg-gray-200 text-black px-3 py-1 rounded hover:bg-gray-300 transition font-semibold text-sm shadow-sm ml-2">Remove</button>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-4 border-t">
                <div className="text-right font-bold text-lg mb-4">Subtotal: ${subtotal.toFixed(2)}</div>
                <button onClick={() => { setCartOpen(false); router.push("/checkout"); }} className="block w-full border border-black text-black text-center py-2 px-4 rounded hover:bg-black hover:text-white transition">Go to Checkout</button>
                <button onClick={() => { setCartOpen(false); router.push("/shop"); }} className="block w-full mt-2 px-6 py-3 border border-[#D4AF37] text-[#D4AF37] rounded hover:bg-[#D4AF37] hover:text-white transition font-semibold shadow-md text-center">Keep Shopping</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Slide-Out */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 space-y-6 relative">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-black"
            aria-label="Close menu"
          >
            ×
          </button>
          <Link href="/" onClick={() => setMenuOpen(false)} className="block text-lg font-medium hover:underline">Home</Link>
          <Link href="/shop" onClick={() => setMenuOpen(false)} className="block text-lg font-medium hover:underline">Shop</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="block text-lg font-medium hover:underline">About</Link>
          <Link href="/reviews" onClick={() => setMenuOpen(false)} className="block text-lg font-medium hover:underline">Reviews</Link>
          <Link href="/checkout" onClick={() => setMenuOpen(false)} className="block py-1 hover:underline font-semibold">Checkout</Link>
        </div>
      </div>
    </nav>
  );
}
