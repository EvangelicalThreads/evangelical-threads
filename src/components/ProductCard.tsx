'use client';
/* eslint-disable @next/next/no-img-element -- external Sanity CDN urls, simple cover crop */

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { trackPixelEvent } from '@/lib/metaPixel';
import { getTotalStock, getLowStockLabel } from '@/lib/inventory';

interface Stock {
  XS: number;
  S: number;
  M: number;
  L: number;
  XL: number;
  XXL: number;
  oneSize: number;
}

export type GridProduct = {
  id: string;
  name: string;
  price: number;
  soldOut: boolean;
  category: string;
  front?: string;
  back?: string;
  stock?: Stock;
};

const sizeKeys: (keyof Stock)[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

/** Shop-grid product tile. Handles its own front/back image preview and a
 *  quick-add-to-cart flow (with an inline size picker for apparel), so
 *  shoppers can add to cart without leaving the grid for the full product
 *  page. The PDP's own add-to-cart flow (ProductDetailsClient) is separate
 *  and untouched. */
export default function ProductCard({ product }: { product: GridProduct }) {
  const { addToCart } = useCart();
  const [showBack, setShowBack] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isApparel = product.category === 'apparel';
  const isSizeAvailable = (size: keyof Stock) => (product.stock?.[size] ?? 0) > 0;
  const hasAnySize = sizeKeys.some((s) => isSizeAvailable(s));
  const lowStockLabel = !product.soldOut
    ? getLowStockLabel(getTotalStock(product.stock, product.category))
    : null;

  const confirmAdded = () => {
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1500);
  };

  const addWithSize = (size?: string) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.front || '',
      quantity: 1,
      size,
    });
    trackPixelEvent('AddToCart', {
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: 'USD',
      contents: [{ id: product.id, quantity: 1 }],
    });
    setSizeOpen(false);
    confirmAdded();
  };

  const handleQuickAdd = () => {
    if (product.soldOut) return;
    if (isApparel) {
      setSizeOpen((open) => !open);
    } else {
      addWithSize(undefined);
    }
  };

  return (
    <div>
      <div
        className="relative aspect-[4/5.2] overflow-hidden bg-[#EDEAE3] mb-3 sm:mb-4 md:mb-5"
        onMouseEnter={() => setShowBack(true)}
        onMouseLeave={() => setShowBack(false)}
      >
        <Link href={`/shop/${product.id}`} className="absolute inset-0 z-0 block">
          {product.soldOut && (
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 text-[8px] sm:text-[9px] uppercase tracking-[0.18em] sm:tracking-[0.24em] text-[#14161a]/60 bg-[#F2F0EB]/90 px-2 py-0.5 sm:px-2.5 sm:py-1">
              Sold Out
            </div>
          )}
          {product.front ? (
            <img
              src={product.front}
              alt={product.name}
              className={`absolute inset-0 h-full w-full object-cover transition duration-500 ease-out ${
                showBack ? 'opacity-0' : 'opacity-100'
              }`}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#EDEAE3]">
              <img
                src="/brand/ryvol-emblem-line-ink.png"
                alt=""
                aria-hidden="true"
                className="w-[22%] opacity-[0.12] select-none"
              />
            </div>
          )}
          {product.back && (
            <img
              src={product.back}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full object-cover transition duration-500 ease-out ${
                showBack ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </Link>

        {/* Front/back swap dots — desktop already swaps on hover; these give
            touch devices the same control with an explicit, reliable tap
            instead of a CSS :hover that can get stuck open on mobile. */}
        {product.back && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            <button
              type="button"
              aria-label="Show front"
              onClick={() => setShowBack(false)}
              className={`w-1.5 h-1.5 rounded-full transition ${
                !showBack ? 'bg-[#14161a]' : 'bg-[#14161a]/30'
              }`}
            />
            <button
              type="button"
              aria-label="Show back"
              onClick={() => setShowBack(true)}
              className={`w-1.5 h-1.5 rounded-full transition ${
                showBack ? 'bg-[#14161a]' : 'bg-[#14161a]/30'
              }`}
            />
          </div>
        )}

        {/* Quick add — sized items open an inline picker; one-size items add
            straight away, same as the PDP's own logic. */}
        {!product.soldOut && (
          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label={justAdded ? 'Added to cart' : 'Quick add to cart'}
            className="absolute bottom-2.5 right-2.5 z-20 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-[#F2F0EB]/95 border border-[#14161a]/25 text-[#14161a] hover:bg-[#14161a] hover:text-[#F2F0EB] hover:border-[#14161a] transition text-[15px] leading-none"
          >
            {justAdded ? '✓' : '+'}
          </button>
        )}

        {sizeOpen && isApparel && (
          <div className="absolute inset-x-2.5 bottom-2.5 z-30 bg-[#F2F0EB] border border-[#14161a]/15 p-2.5">
            {hasAnySize ? (
              <div className="flex flex-wrap gap-1.5">
                {sizeKeys.map((size) => {
                  const available = isSizeAvailable(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={!available}
                      onClick={() => addWithSize(size)}
                      className={`flex-1 min-w-[30px] h-8 text-[10px] uppercase border transition ${
                        !available
                          ? 'border-[#14161a]/15 text-[#14161a]/25 cursor-not-allowed line-through'
                          : 'border-[#14161a]/30 text-[#14161a] hover:border-[#14161a] hover:bg-[#14161a] hover:text-[#F2F0EB]'
                      }`}
                    >
                      {size === 'XXL' ? '2XL' : size}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#14161a]/45 text-center py-1.5">
                Out of stock
              </p>
            )}
          </div>
        )}
      </div>

      <p className="rv-serif italic text-[15px] leading-[1.25] sm:text-[16px] md:text-[19px] text-[#14161a]">
        {product.name}
      </p>
      <p className="mt-1 text-[9px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[#14161a]/45">
        ${product.price}
      </p>
      {lowStockLabel && (
        <p className="mt-0.5 text-[9px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[var(--rv-navy)]">
          {lowStockLabel}
        </p>
      )}
    </div>
  );
}
