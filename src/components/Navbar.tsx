"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect, useMemo } from "react";
import { useCart } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

// RYVOL palette:
// Off-white: #F2F0EB
// Ink: #14161a
// Rust: #A1543E

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

  const cartRefDesktop = useRef<HTMLDivElement>(null);
  const cartRefMobile = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        isCartOpen &&
        !cartRefDesktop.current?.contains(target) &&
        !cartRefMobile.current?.contains(target) &&
        !(
          target instanceof HTMLElement &&
          target.closest('[aria-label="Toggle cart"]')
        )
      ) {
        toggleCart();
      }

      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        !(
          target instanceof HTMLElement &&
          target.closest('[aria-label="Toggle menu"]')
        )
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen, toggleCart]);

  const totalCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-[#14161a]/10 bg-[#F2F0EB]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Wordmark */}
        <Link
          href="/"
          className="flex min-w-0 items-center"
          aria-label="RYVOL home"
        >
          {/* Replace with the custom SVG when ready:

          <Image
            src="/ryvol-wordmark.svg"
            alt="RYVOL"
            width={110}
            height={18}
            draggable={false}
          />

          */}

          <span className="rv-wordmark text-[15px] uppercase text-[#14161a]">
            RYVOL
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="relative hidden items-center gap-10 md:flex">
          <Link
            href="/shop"
            className="rv-navlink text-[#14161a]/75 transition hover:text-[#14161a]"
          >
            SHOP
          </Link>

          <Link
            href="/about"
            className="rv-navlink text-[#14161a]/75 transition hover:text-[#14161a]"
          >
            ABOUT
          </Link>

          <button
            aria-label="Toggle cart"
            onClick={toggleCart}
            className="relative p-2 text-[#14161a]"
          >
            <ShoppingCart className="h-5 w-5" />

            {totalCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#A1543E] text-[10px] text-[#F2F0EB]">
                {totalCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Navigation Controls */}
        <div className="flex items-center gap-3 text-[#14161a] md:hidden">
          <button
            aria-label="Toggle cart"
            onClick={toggleCart}
            className="relative p-1"
          >
            <ShoppingCart className="h-5 w-5" />

            {totalCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#A1543E] text-[10px] font-semibold text-[#F2F0EB]">
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
              className="h-5 w-5"
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
          className="fixed right-4 top-20 z-50 hidden w-[90%] max-w-full border border-[#14161a]/12 bg-[#F2F0EB] p-5 sm:w-96 md:block"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="rv-navlink text-[13px] text-[#14161a]">
              CART
            </h3>

            <button
              onClick={toggleCart}
              className="text-xl font-bold text-[#14161a]/50 hover:text-[#14161a]"
              aria-label="Close cart"
            >
              ×
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="mt-6 text-center">
              <p className="mb-5 text-sm text-[#14161a]/50">
                Your pursuit starts here.
              </p>

              <button
                onClick={() => {
                  toggleCart();
                  router.push("/shop");
                }}
                className="inline-block bg-[#14161a] px-7 py-3 text-[10px] uppercase tracking-[0.28em] text-[#F2F0EB] transition hover:bg-[#A1543E]"
              >
                Shop the Drop
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Cart Items */}
              <ul className="max-h-64 divide-y divide-[#14161a]/10 overflow-y-auto">
                {cart.map((item) => (
                  <li
                    key={`${item.id}-${item.size}`}
                    className="flex items-center gap-3 py-3"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="object-cover"
                    />

                    <div className="flex-grow">
                      <p className="text-sm font-medium">{item.name}</p>

                      {item.size && (
                        <p className="text-xs text-[#14161a]/50">
                          Size: {item.size}
                        </p>
                      )}

                      <p className="text-sm text-[#14161a]/60">
                        {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            decreaseQty(item.id, item.size)
                          }
                          className="border border-[#14161a]/20 px-2 transition hover:border-[#14161a]"
                        >
                          −
                        </button>

                        <span className="px-1 text-sm">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQty(item.id, item.size)
                          }
                          className="border border-[#14161a]/20 px-2 transition hover:border-[#14161a]"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          removeFromCart(item.id, item.size)
                        }
                        className="text-xs text-[#14161a]/50 transition hover:text-[#A1543E]"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 text-right text-sm font-semibold">
                Subtotal: ${total.toFixed(2)}
              </div>

              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => {
                    toggleCart();
                    router.push("/shop");
                  }}
                  className="mt-4 flex-1 border border-[#14161a] px-4 py-3 text-center text-[10px] uppercase tracking-[0.24em] text-[#14161a] transition hover:bg-[#14161a] hover:text-[#F2F0EB]"
                >
                  Add More
                </button>

                <button
                  onClick={() => {
                    toggleCart();
                    router.push("/checkout");
                  }}
                  className="mt-4 flex-1 bg-[#14161a] px-4 py-3 text-center text-[10px] uppercase tracking-[0.24em] text-[#F2F0EB] transition hover:bg-[#A1543E]"
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
        className={`fixed right-0 top-0 z-50 h-full w-80 max-w-full transform border-l border-[#14161a]/10 bg-[#F2F0EB] transition-transform duration-300 ease-in-out md:hidden ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="rv-navlink text-[13px] text-[#14161a]">
              CART
            </h3>

            <button
              onClick={toggleCart}
              className="text-xl font-bold text-[#14161a]/50"
              aria-label="Close cart"
            >
              ×
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="mt-10 text-center">
              <p className="text-sm text-[#14161a]/50">
                Your pursuit starts here.
              </p>

              <button
                onClick={() => {
                  toggleCart();
                  router.push("/shop");
                }}
                className="mt-5 inline-block bg-[#14161a] px-7 py-3 text-[10px] uppercase tracking-[0.28em] text-[#F2F0EB] transition hover:bg-[#A1543E]"
              >
                Shop the Drop
              </button>
            </div>
          ) : (
            <>
              <ul className="max-h-[50vh] overflow-y-auto">
                {cart.map((item) => (
                  <li
                    key={item.id + item.size}
                    className="mb-4 flex items-center justify-between border-b border-[#14161a]/10 pb-2"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={56}
                        height={56}
                        className="object-cover"
                      />

                      <div>
                        <p className="text-sm font-medium">
                          {item.name}
                        </p>

                        {item.size && (
                          <p className="text-xs text-[#14161a]/50">
                            Size: {item.size}
                          </p>
                        )}

                        <p className="text-sm text-[#14161a]/60">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          decreaseQty(item.id, item.size)
                        }
                        className="border border-[#14161a]/20 px-2 py-1 text-sm"
                      >
                        −
                      </button>

                      <span className="px-1 text-sm">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQty(item.id, item.size)
                        }
                        className="border border-[#14161a]/20 px-2 py-1 text-sm"
                      >
                        +
                      </button>

                      <button
                        onClick={() =>
                          removeFromCart(item.id, item.size)
                        }
                        className="ml-2 px-2 text-sm text-[#14161a]/50 hover:text-[#A1543E]"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-auto border-t border-[#14161a]/10 pt-4">
                <div className="mb-4 text-right font-semibold">
                  Subtotal: ${total.toFixed(2)}
                </div>

                <button
                  onClick={() => {
                    toggleCart();
                    router.push("/checkout");
                  }}
                  className="block w-full bg-[#14161a] px-4 py-3 text-center text-[10px] uppercase tracking-[0.24em] text-[#F2F0EB] transition hover:bg-[#A1543E]"
                >
                  Go to Checkout
                </button>

                <button
                  onClick={() => {
                    toggleCart();
                    router.push("/shop");
                  }}
                  className="mt-2 block w-full border border-[#14161a] px-4 py-3 text-center text-[10px] uppercase tracking-[0.24em] text-[#14161a] transition hover:bg-[#14161a] hover:text-[#F2F0EB]"
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
        className={`fixed right-0 top-0 z-50 h-full w-64 transform border-l border-[#14161a]/10 bg-[#F2F0EB] transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="relative space-y-7 p-6 pt-16">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute right-4 top-4 text-2xl font-bold text-[#14161a]/50 hover:text-[#14161a]"
            aria-label="Close menu"
          >
            ×
          </button>

          <Link
            href="/shop"
            onClick={() => setMenuOpen(false)}
            className="rv-navlink block text-[13px] text-[#14161a]/75 hover:text-[#14161a]"
          >
            SHOP
          </Link>

          <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            className="rv-navlink block text-[13px] text-[#14161a]/75 hover:text-[#14161a]"
          >
            ABOUT
          </Link>

          <Link
            href="/faq"
            onClick={() => setMenuOpen(false)}
            className="rv-navlink block text-[13px] text-[#14161a]/75 hover:text-[#14161a]"
          >
            FAQ
          </Link>

          <Link
            href="/privacy"
            onClick={() => setMenuOpen(false)}
            className="rv-navlink block text-[13px] text-[#14161a]/75 hover:text-[#14161a]"
          >
            PRIVACY
          </Link>
        </div>
      </div>
    </nav>
  );
}