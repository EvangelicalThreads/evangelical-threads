'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useCart } from '../../../context/CartContext';
import Link from 'next/link';
import { trackPixelEvent } from '@/lib/metaPixel';

interface SizeChartRow {
  size: string;
  width: string;
  length: string;
}

interface Stock {
  XS: number;
  S: number;
  M: number;
  L: number;
  XL: number;
  XXL: number;
  oneSize: number;
}

interface ProductImage {
  url: string;
  label: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  soldOut: boolean;
  stock: Stock;
  category: string;
  // Apparel fixed slots
  imageFront?: string;
  imageBack?: string;
  modelFront?: string;
  modelBack?: string;
  flatLayFront?: string;
  flatLayBack?: string;
  // Non-apparel flexible array
  images?: ProductImage[];
  sizeChart: SizeChartRow[];
}

type ApparelView = 'imageFront' | 'imageBack' | 'modelFront' | 'modelBack' | 'flatLayFront' | 'flatLayBack';

const apparelViews: { key: ApparelView; label: string }[] = [
  { key: 'imageFront', label: 'Front' },
  { key: 'imageBack', label: 'Back' },
  { key: 'modelFront', label: 'Model Front' },
  { key: 'modelBack', label: 'Model Back' },
  { key: 'flatLayFront', label: 'Flat Lay Front' },
  { key: 'flatLayBack', label: 'Flat Lay Back' },
];

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  created_at: string;
}

function StarDisplay({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span aria-hidden="true" style={{ fontSize: size }} className="tracking-[0.1em] leading-none">
      <span className="text-[var(--rv-navy)]">{'★'.repeat(Math.round(rating))}</span>
      <span className="text-[#14161a]/20">{'★'.repeat(5 - Math.round(rating))}</span>
    </span>
  );
}

function timeAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

function ReviewsSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const loadReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`);
      const data = await res.json();
      setReviews(data.reviews || []);
      setAverage(data.average || 0);
      setCount(data.count || 0);
    } catch {
      // Quiet failure — reviews are supplementary, not core to the page.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim() || !email.trim() || !rating || text.trim().length < 3) {
      setFormError('Fill in a name, email, rating, and a few words.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, name, email, rating, text }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      setShowForm(false);
      await loadReviews(); // it's live immediately — show it now
      setName('');
      setEmail('');
      setRating(0);
      setText('');
    } catch {
      setFormError('Something went wrong. Try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="reviews" className="mt-24 md:mt-32 pt-16 border-t border-[#14161a]/10">
      <div className="flex flex-wrap items-baseline justify-between gap-4 mb-12">
        <p className="text-[10px] uppercase tracking-[0.24em] text-[#14161a]/45">Reviews</p>
        {!loading && count > 0 && (
          <div className="flex items-center gap-2.5">
            <StarDisplay rating={average} size={14} />
            <span className="text-[12px] text-[#14161a]/60">
              {average.toFixed(1)} · {count} review{count !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {!loading && count === 0 && (
        <p className="text-[13px] text-[#14161a]/50 mb-10">No reviews yet. Be the first.</p>
      )}

      {reviews.length > 0 && (
        <ul className="divide-y divide-[#14161a]/8 mb-12">
          {reviews.map((r) => (
            <li key={r.id} className="py-6">
              <div className="flex items-center justify-between gap-4 mb-2">
                <p className="rv-serif italic text-[16px] text-[#14161a]">{r.name}</p>
                <StarDisplay rating={r.rating} />
              </div>
              <p className="text-[14px] leading-[1.8] text-[#14161a]/70 mb-1.5">{r.text}</p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#14161a]/35">
                {timeAgo(r.created_at)}
              </p>
            </li>
          ))}
        </ul>
      )}

      {submitted && (
        <p className="text-[13px] text-[#14161a]/60 mb-6">
          Thanks, your review is live.
        </p>
      )}

      {!showForm && !submitted && (
        <button
          onClick={() => setShowForm(true)}
          className="text-[11px] uppercase tracking-[0.2em] text-[#14161a]/70 border-b border-[#14161a]/30 pb-0.5 hover:text-[#14161a] hover:border-[#14161a] transition"
        >
          Write a Review
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="max-w-md">
          <div className="mb-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#14161a]/45 mb-2.5">Rating</p>
            <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} star${n > 1 ? 's' : ''}`}
                  onMouseEnter={() => setHoverRating(n)}
                  onClick={() => setRating(n)}
                  className="text-[24px] leading-none transition"
                  style={{ color: n <= (hoverRating || rating) ? 'var(--rv-navy)' : 'rgba(20,22,26,0.18)' }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-[#14161a]/20 bg-transparent px-3.5 py-2.5 text-[13px] text-[#14161a] placeholder:text-[#14161a]/40 focus:outline-none focus:border-[#14161a]"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-[#14161a]/20 bg-transparent px-3.5 py-2.5 text-[13px] text-[#14161a] placeholder:text-[#14161a]/40 focus:outline-none focus:border-[#14161a]"
            />
          </div>

          <textarea
            placeholder="Your review"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            maxLength={800}
            className="w-full border border-[#14161a]/20 bg-transparent px-3.5 py-2.5 text-[13px] text-[#14161a] placeholder:text-[#14161a]/40 focus:outline-none focus:border-[#14161a] mb-4 resize-none"
          />

          {formError && <p className="text-[12px] text-[var(--rv-navy)] mb-4">{formError}</p>}

          <div className="flex items-center gap-6">
            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-2.5 border border-[#14161a] text-[11px] uppercase tracking-[0.2em] text-[#14161a] hover:bg-[#14161a] hover:text-[#F2F0EB] transition disabled:opacity-40"
            >
              {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-[11px] uppercase tracking-[0.2em] text-[#14161a]/45 hover:text-[#14161a] transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function ProductDetailsClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [selectedView, setSelectedView] = useState<ApparelView>('imageFront');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeChart, setShowSizeChart] = useState(false);

  const isApparel = product.category === 'apparel';
  const sizeKeys: (keyof Stock)[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    trackPixelEvent('ViewContent', {
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: 'USD',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const isSizeAvailable = (size: keyof Stock) => product.stock?.[size] > 0;

  // For apparel use fixed slots, for others use flexible array
  const currentImage = isApparel
    ? product[selectedView] || ''
    : product.images?.[selectedIndex]?.url || '';

  // Only show buttons for slots that actually have an image
  const availableApparelViews = apparelViews.filter(({ key }) => !!product[key]);

  const handleAddToCart = () => {
    if (isApparel && !selectedSize) {
      alert('Please select a size before adding to cart.');
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: isApparel ? (product.imageFront || '') : (product.images?.[0]?.url || ''),
      quantity: 1,
      size: selectedSize || undefined,
    });
    trackPixelEvent('AddToCart', {
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: 'USD',
      contents: [{ id: product.id, quantity: 1 }],
    });
  };

  return (
    <main className="bg-[#F2F0EB] min-h-screen text-[#14161a]">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          <div className="w-full">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#EDEAE3]">
              {currentImage && (
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
              )}
            </div>

            {/* Apparel image view switcher */}
            {isApparel && availableApparelViews.length > 1 && (
              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-6 justify-center">
                {availableApparelViews.map(({ key, label }) => (
                  <button
                    key={key}
                    className={`text-[10px] uppercase tracking-[0.2em] pb-0.5 border-b transition ${
                      selectedView === key
                        ? 'border-[#14161a] text-[#14161a]'
                        : 'border-transparent text-[#14161a]/40 hover:text-[#14161a] hover:border-[#14161a]/40'
                    }`}
                    onClick={() => setSelectedView(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* Non-apparel image switcher */}
            {!isApparel && product.images && product.images.length > 1 && (
              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-6 justify-center">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`text-[10px] uppercase tracking-[0.2em] pb-0.5 border-b transition ${
                      selectedIndex === i
                        ? 'border-[#14161a] text-[#14161a]'
                        : 'border-transparent text-[#14161a]/40 hover:text-[#14161a] hover:border-[#14161a]/40'
                    }`}
                    onClick={() => setSelectedIndex(i)}
                  >
                    {img.label || `Image ${i + 1}`}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="rv-serif italic text-[30px] md:text-[36px] leading-[1.1] text-[#14161a] mb-2">
              {product.name}
            </p>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#14161a]/45 mb-8">
              ${product.price}
            </p>

            {product.description && (
              <p className="text-[15px] leading-[1.9] text-[#14161a]/70 whitespace-pre-line mb-6 max-w-md">
                {product.description}
              </p>
            )}

            <p className="text-[10px] uppercase tracking-[0.22em] text-[#14161a]/35 mb-10">
              Limited First Drop — No Restocks Once Sold Out
            </p>

            {isApparel && (
              <div className="mb-8">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#14161a]/45 mb-3">
                  Size
                </p>
                <div className="flex gap-2 flex-wrap">
                  {sizeKeys.map((size) => {
                    const available = isSizeAvailable(size);
                    const selected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        disabled={!available}
                        className={`w-11 h-11 text-[11px] uppercase tracking-[0.05em] border transition ${
                          !available
                            ? 'border-[#14161a]/15 text-[#14161a]/25 cursor-not-allowed line-through'
                            : selected
                            ? 'border-[#14161a] bg-[#14161a] text-[#F2F0EB]'
                            : 'border-[#14161a]/30 text-[#14161a] hover:border-[#14161a]'
                        }`}
                        onClick={() => available && setSelectedSize(size)}
                      >
                        {size === 'XXL' ? '2XL' : size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {product.sizeChart?.length > 0 && (
              <button
                onClick={() => setShowSizeChart(true)}
                className="text-[11px] uppercase tracking-[0.2em] text-[#14161a]/55 border-b border-[#14161a]/25 pb-0.5 hover:text-[#14161a] hover:border-[#14161a] transition mb-10 block"
              >
                View Size Chart
              </button>
            )}

            {showSizeChart && product.sizeChart?.length > 0 && (
              <div className="fixed inset-0 bg-[#14161a]/40 backdrop-blur-sm flex justify-center items-center z-50 px-6">
                <div className="bg-[#F2F0EB] border border-[#14161a]/15 p-8 w-full max-w-lg relative">
                  <button
                    onClick={() => setShowSizeChart(false)}
                    className="absolute top-4 right-4 text-[#14161a]/50 hover:text-[#14161a] text-xl leading-none"
                    aria-label="Close"
                  >
                    ×
                  </button>
                  <p className="rv-serif italic text-[22px] text-center text-[#14161a] mb-6">
                    Size Chart
                  </p>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-[#14161a]/15">
                        <th className="p-2 text-left text-[10px] uppercase tracking-[0.18em] text-[#14161a]/50 font-normal">Size</th>
                        <th className="p-2 text-left text-[10px] uppercase tracking-[0.18em] text-[#14161a]/50 font-normal">Width (in)</th>
                        <th className="p-2 text-left text-[10px] uppercase tracking-[0.18em] text-[#14161a]/50 font-normal">Length (in)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.sizeChart.map((row, i) => (
                        <tr key={i} className="border-b border-[#14161a]/8 last:border-0">
                          <td className="p-2 text-[13px] text-[#14161a]">{row.size}</td>
                          <td className="p-2 text-[13px] text-[#14161a]/70">{row.width}</td>
                          <td className="p-2 text-[13px] text-[#14161a]/70">{row.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[#14161a]/35 mt-5 text-center">
                    Measurements can vary within 2.5cm
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={product.soldOut ? undefined : handleAddToCart}
              disabled={product.soldOut}
              className={`px-9 py-3.5 text-[11px] uppercase tracking-[0.24em] border transition ${
                product.soldOut
                  ? 'border-[#14161a]/15 text-[#14161a]/30 cursor-not-allowed'
                  : 'border-[#14161a] text-[#14161a] hover:bg-[#14161a] hover:text-[#F2F0EB]'
              }`}
            >
              {product.soldOut ? 'Sold Out' : 'Add to Cart'}
            </button>
          </div>
        </div>

        <ReviewsSection productId={product.id} />

        <div className="mt-24 text-center">
          <Link
            href="/shop"
            className="text-[11px] uppercase tracking-[0.22em] text-[#14161a]/60 border-b border-[#14161a]/25 pb-0.5 hover:text-[#14161a] hover:border-[#14161a] transition"
          >
            View More
          </Link>
        </div>
      </div>
    </main>
  );
}
