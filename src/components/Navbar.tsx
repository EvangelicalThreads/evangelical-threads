"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect, useMemo } from "react";
import { useCart } from "../context/CartContext";
import { ShoppingCart, User, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const {
    cart,
    toggleCart,
    isCartOpen,
    removeFromCart,
    increaseQty,
    decreaseQty,
    total,
  } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const cartRefDesktop = useRef<HTMLDivElement>(null);
  const cartRefMobile = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        isCartOpen &&
        !cartRefDesktop.current?.contains(target) &&
        !cartRefMobile.current?.contains(target) &&
        !(target instanceof HTMLElement && target.closest('[aria-label="Toggle cart"]'))
      ) {
        toggleCart();
      }

      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        !(target instanceof HTMLElement && target.closest('[aria-label="Toggle menu"]'))
      ) {
        setMenuOpen(false);
      }

      if (
        aboutRef.current &&
        !aboutRef.current.contains(target) &&
        !(target instanceof HTMLElement && target.closest('[aria-label="Toggle about dropdown"]'))
      ) {
        setAboutDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCartOpen, toggleCart]);

  const totalCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4">
        <Link href="/" className="flex items-center gap-2 min-w-0">
          <Image
            src="/logo-nav.png"
            alt="Evangelical Threads Logo"
            width={27}
            height={27}
            className="object-contain"
            draggable={false}
          />
          <span className="text-base font-bold tracking-tight truncate">
            Evangelical Threads
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 relative">
          <Link href="/shop" className="hover:underline">
            Shop
          </Link>

          <div className="relative" ref={aboutRef}>
            <button
              aria-label="Toggle about dropdown"
              onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
              className="flex items-center gap-1 text-black font-medium hover:underline focus:outline-none"
            >
              About <ChevronDown className="w-4 h-4" />
            </button>

            {aboutDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
                <Link
                  href="/how-we-work"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setAboutDropdownOpen(false)}
                >
                  How We Work
                </Link>
                <Link
                  href="/faq"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setAboutDropdownOpen(false)}
                >
                  FAQ
                </Link>
                <Link
                  href="/about"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setAboutDropdownOpen(false)}
                >
                  About Us
                </Link>
              </div>
            )}
          </div>

          <Link href="/reviews" className="hover:underline">Reviews</Link>
          <Link href="/checkout" className="hover:underline font-semibold">Checkout</Link>
          <Link href="/login" className="hover:underline flex items-center">
            <User className="w-5 h-5" />
          </Link>
          <button
            aria-label="Toggle cart"
            onClick={toggleCart}
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

        <div className="flex md:hidden items-center gap-2">
          <Link href="/login" aria-label="Login">
            <User className="w-5 h-5" />
          </Link>
          <button
            aria-label="Toggle cart"
            onClick={toggleCart}
            className="relative p-1"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-semibold">
                {totalCount}
              </span>
            )}
          </button>
          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  menuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop Cart */}
      {isCartOpen && (
        <div
          ref={cartRefDesktop}
          className="hidden md:block fixed top-16 right-4 w-[90%] sm:w-96 max-w-full bg-white border rounded-lg shadow-lg p-4 z-50"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Your Cart</h3>
            <button
              onClick={toggleCart}
              className="text-xl font-bold text-gray-600 hover:text-black"
              aria-label="Close cart"
            >
              ×
            </button>
          </div>
          {cart.length === 0 ? (
            <div className="text-center mt-6">
              <p className="text-gray-500 mb-4">Cart is empty</p>
              <button
                onClick={() => {
                  toggleCart();
                  router.push("/shop");
                }}
                className="inline-block px-6 py-2 border border-[#D4AF37] text-[#D4AF37] rounded hover:bg-[#D4AF37] hover:text-white transition font-semibold shadow-md"
              >
                Shop Products
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Cart Items */}
<ul className="max-h-64 overflow-y-auto divide-y">
  {cart.map((item) => (
    <li key={`${item.id}-${item.size}`} className="py-3 flex gap-3 items-center">
      <Image
        src={item.image}
        alt={item.name}
        width={64}     // w-16 = 64px
        height={64}
        className="rounded object-cover"
      />
      <div className="flex-grow">
        <p className="font-semibold">{item.name}</p>
        {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
        <p className="text-sm text-gray-600">
          {item.quantity} × ${item.price.toFixed(2)}
        </p>
      </div>
      <div className="flex flex-col gap-1 items-end">
        <div className="flex items-center gap-1">
          <button onClick={() => decreaseQty(item.id, item.size)} className="bg-gray-200 px-2 rounded">−</button>
          <span>{item.quantity}</span>
          <button onClick={() => increaseQty(item.id, item.size)} className="bg-gray-200 px-2 rounded">+</button>
        </div>
        <button onClick={() => removeFromCart(item.id, item.size)} className="text-xs text-gray-600 hover:text-black">
          Remove
        </button>
      </div>
    </li>
  ))}
</ul>
              <div className="mt-4 text-right font-semibold">Subtotal: ${total.toFixed(2)}</div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    toggleCart();
                    router.push("/shop");
                  }}
                  className="mt-6 border border-[#D4AF37] text-[#D4AF37] px-6 py-3 rounded hover:bg-[#D4AF37] hover:text-white transition font-semibold shadow-md text-center"
                >
                  Add more
                </button>
                <button
                  onClick={() => {
                    toggleCart();
                    router.push("/checkout");
                  }}
                  className="mt-6 bg-white text-black border border-black px-6 py-3 rounded hover:bg-gray-100 transition font-semibold shadow-sm"
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Mobile Cart Slide-In */}
      <div
        ref={cartRefMobile}
        className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Your Cart</h3>
            <button onClick={toggleCart} className="text-xl font-bold text-gray-600">×</button>
          </div>
          {cart.length === 0 ? (
            <div className="text-center mt-10">
              <p className="text-gray-500">Your cart is empty.</p>
              <button
                onClick={() => {
                  toggleCart();
                  router.push("/shop");
                }}
                className="inline-block mt-4 px-6 py-2 border border-[#D4AF37] text-[#D4AF37] rounded hover:bg-[#D4AF37] hover:text-white transition font-semibold shadow-md"
              >
                Shop Products
              </button>
            </div>
          ) : (
            <>
              <ul className="max-h-[50vh] overflow-y-auto">
  {cart.map((item) => (
    <li key={item.id + item.size} className="flex items-center justify-between mb-4 border-b pb-2">
      <div className="flex items-center gap-3">
        <Image
          src={item.image}
          alt={item.name}
          width={56}     // w-14 ~ 56px
          height={56}
          className="object-cover rounded"
        />
        <div>
          <p className="font-medium">{item.name}</p>
          {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
          <p className="text-sm text-gray-600">{item.quantity} × ${item.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => decreaseQty(item.id, item.size)} className="px-2 py-1 text-sm bg-gray-200 rounded">−</button>
        <span className="px-1">{item.quantity}</span>
        <button onClick={() => increaseQty(item.id, item.size)} className="px-2 py-1 text-sm bg-gray-200 rounded">+</button>
        <button onClick={() => removeFromCart(item.id, item.size)} className="ml-2 px-2 text-sm text-gray-600 hover:text-black">Remove</button>
      </div>
    </li>
  ))}
</ul>
              <div className="mt-auto pt-4 border-t">
                <div className="text-right font-bold text-lg mb-4">Subtotal: ${total.toFixed(2)}</div>
                <button
                  onClick={() => {
                    toggleCart();
                    router.push("/checkout");
                  }}
                  className="block w-full border border-black text-black text-center py-2 px-4 rounded hover:bg-black hover:text-white transition"
                >
                  Go to Checkout
                </button>
                <button
                  onClick={() => {
                    toggleCart();
                    router.push("/shop");
                  }}
                  className="block w-full mt-2 px-6 py-3 border border-[#D4AF37] text-[#D4AF37] rounded hover:bg-[#D4AF37] hover:text-white transition font-semibold shadow-md text-center"
                >
                  Keep Shopping
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Slide-In */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 space-y-6 relative">
          <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-black">×</button>
          <Link href="/" onClick={() => setMenuOpen(false)} className="block text-lg font-medium hover:underline">Home</Link>
          <Link href="/shop" onClick={() => setMenuOpen(false)} className="block text-lg font-medium hover:underline">Shop</Link>
          <Link href="/how-we-work" onClick={() => setMenuOpen(false)} className="block text-lg font-medium hover:underline">How We Work</Link>
          <Link href="/faq" onClick={() => setMenuOpen(false)} className="block text-lg font-medium hover:underline">FAQ</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="block text-lg font-medium hover:underline">About Us</Link>
          <Link href="/reviews" onClick={() => setMenuOpen(false)} className="block text-lg font-medium hover:underline">Reviews</Link>
          <Link href="/checkout" onClick={() => setMenuOpen(false)} className="block text-lg font-medium hover:underline">Checkout</Link>
        </div>
      </div>
    </nav>
  );
}
