"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect, useMemo } from "react";
import { useCart } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { FaInstagram, FaTiktok } from "react-icons/fa";

// RYVOL palette:
// Off-white: #F2F0EB
// Ink: #14161a
// Navy accent: var(--rv-navy)

// Free shipping unlocks past this subtotal — adjust freely, it's the only
// place this number lives.
const FREE_SHIPPING_THRESHOLD = 50;

function ShippingProgress({ total }: { total: number }) {
  const remaining = FREE_SHIPPING_THRESHOLD - total;
  if (remaining <= 0) {
    return (
      <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-[var(--rv-navy)]">
        Free Shipping Unlocked
      </p>
    );
  }
  return (
    <div className="mb-5">
      <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-[#14161a]/50">
        ${remaining.toFixed(2)} away from free shipping
      </p>
      <div className="h-[2px] w-full bg-[#14161a]/10">
        <div
          className="h-full bg-[var(--rv-navy)] transition-all duration-500"
          style={{ width: `${Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
        />
      </div>
    </div>
  );
}

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
        {/* Wordmark — emblem + serif italic, matching the mark everywhere
            else it appears (hero, About, footer). */}
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5"
          aria-label="RYVOL home"
        >
          <Image
            src="/brand/ryvol-emblem-navy.png"
            alt=""
            aria-hidden="true"
            width={26}
            height={26}
            className="shrink-0"
            draggable={false}
          />
          <span className="rv-serif italic text-[20px] md:text-[22px] text-[#14161a]">
            Ryvol
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
              <span className="absolute -right-0.5 -top-0.5 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--rv-navy)] text-[10px] text-[#F2F0EB]">
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
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--rv-navy)] text-[10px] font-semibold text-[#F2F0EB]">
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
                className="inline-block bg-[#14161a] px-7 py-3 text-[10px] uppercase tracking-[0.28em] text-[#F2F0EB] transition hover:bg-[var(--rv-navy)]"
              >
                Shop the Drop
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Cart Items */}
              <ul className="max-h-72 divide-y divide-[#14161a]/8 overflow-y-auto">
                {cart.map((item) => (
                  <li
                    key={`${item.id}-${item.size}`}
                    className="flex items-center gap-4 py-4"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-[#EDEAE3]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-grow">
                      <p className="rv-serif italic text-[15px] text-[#14161a]">{item.name}</p>

                      {item.size && (
                        <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-[#14161a]/45">
                          Size: {item.size}
                        </p>
                      )}

                      <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#14161a]/45">
                        {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-3 text-[13px] text-[#14161a]">
                        <button
                          onClick={() =>
                            decreaseQty(item.id, item.size)
                          }
                          className="w-3 text-[#14161a]/50 transition hover:text-[#14161a]"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <span className="w-3 text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQty(item.id, item.size)
                          }
                          className="w-3 text-[#14161a]/50 transition hover:text-[#14161a]"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          removeFromCart(item.id, item.size)
                        }
                        className="text-[10px] uppercase tracking-[0.14em] text-[#14161a]/40 transition hover:text-[var(--rv-navy)]"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-5 pt-4 border-t border-[#14161a]/10">
                <ShippingProgress total={total} />
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#14161a]/50">
                    Subtotal
                  </span>
                  <span className="rv-serif italic text-[19px] text-[#14161a]">
                    ${total.toFixed(2)}
                  </span>
                </div>
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
                  className="mt-4 flex-1 bg-[#14161a] px-4 py-3 text-center text-[10px] uppercase tracking-[0.24em] text-[#F2F0EB] transition hover:bg-[var(--rv-navy)]"
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
                className="mt-5 inline-block bg-[#14161a] px-7 py-3 text-[10px] uppercase tracking-[0.28em] text-[#F2F0EB] transition hover:bg-[var(--rv-navy)]"
              >
                Shop the Drop
              </button>
            </div>
          ) : (
            <>
              <ul className="max-h-[46vh] overflow-y-auto">
                {cart.map((item) => (
                  <li
                    key={item.id + item.size}
                    className="mb-4 flex items-center justify-between border-b border-[#14161a]/8 pb-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-[#EDEAE3]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div>
                        <p className="rv-serif italic text-[14px] text-[#14161a]">
                          {item.name}
                        </p>

                        {item.size && (
                          <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-[#14161a]/45">
                            Size: {item.size}
                          </p>
                        )}

                        <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#14161a]/45">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2.5 text-[13px] text-[#14161a]">
                        <button
                          onClick={() =>
                            decreaseQty(item.id, item.size)
                          }
                          className="w-3 text-[#14161a]/50"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <span className="w-3 text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQty(item.id, item.size)
                          }
                          className="w-3 text-[#14161a]/50"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          removeFromCart(item.id, item.size)
                        }
                        className="text-[10px] uppercase tracking-[0.14em] text-[#14161a]/40 hover:text-[var(--rv-navy)]"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-auto border-t border-[#14161a]/10 pt-4">
                <ShippingProgress total={total} />
                <div className="mb-4 flex items-baseline justify-between">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#14161a]/50">
                    Subtotal
                  </span>
                  <span className="rv-serif italic text-[19px] text-[#14161a]">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    toggleCart();
                    router.push("/checkout");
                  }}
                  className="block w-full bg-[#14161a] px-4 py-3 text-center text-[10px] uppercase tracking-[0.24em] text-[#F2F0EB] transition hover:bg-[var(--rv-navy)]"
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
        className={`fixed right-0 top-0 z-50 h-full w-[82%] max-w-[380px] transform border-l border-[#14161a]/10 bg-[#F2F0EB] transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-8 pt-9">
          <div className="mb-20 flex items-center justify-between">
            <Image
              src="/brand/ryvol-emblem-navy.png"
              alt="RYVOL"
              width={30}
              height={30}
            />
            <button
              onClick={() => setMenuOpen(false)}
              className="text-2xl leading-none text-[#14161a]/50 transition hover:text-[#14161a]"
              aria-label="Close menu"
            >
              ×
            </button>
          </div>

          <nav className="flex flex-col gap-8">
            <Link
              href="/shop"
              onClick={() => setMenuOpen(false)}
              className="rv-serif italic text-[30px] leading-none text-[#14161a] transition hover:text-[var(--rv-navy)]"
            >
              Shop
            </Link>

            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="rv-serif italic text-[30px] leading-none text-[#14161a] transition hover:text-[var(--rv-navy)]"
            >
              About
            </Link>

            <Link
              href="/faq"
              onClick={() => setMenuOpen(false)}
              className="rv-serif italic text-[30px] leading-none text-[#14161a] transition hover:text-[var(--rv-navy)]"
            >
              FAQ
            </Link>
          </nav>

          <div className="mt-auto border-t border-[#14161a]/10 pt-8">
            <Link
              href="/privacy"
              onClick={() => setMenuOpen(false)}
              className="mb-8 block text-[10px] uppercase tracking-[0.2em] text-[#14161a]/40 transition hover:text-[#14161a]"
            >
              Privacy
            </Link>

            <div className="flex gap-6 text-[#14161a]/60 text-lg">
              <a
                href="https://www.instagram.com/shopryvol"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram className="transition hover:text-[#14161a]" />
              </a>

              <a
                href="https://www.tiktok.com/@shopryvol"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <FaTiktok className="transition hover:text-[#14161a]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}