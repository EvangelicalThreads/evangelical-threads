'use client';

import { useEffect, useState } from 'react';

interface Review {
  id: string;
  product_id: string;
  name: string;
  email: string;
  rating: number;
  text: string;
  created_at: string;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-[13px] tracking-[0.1em] text-[var(--rv-navy)]">
      {'★'.repeat(rating)}
      <span className="text-[#14161a]/20">{'★'.repeat(5 - rating)}</span>
    </span>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const res = await fetch('/api/admin/reviews');
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleDelete = async (id: string) => {
    await fetch('/api/admin/reviews/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    await refresh();
  };

  return (
    <main className="bg-[#F2F0EB] min-h-screen text-[#14161a]">
      <div className="max-w-[720px] mx-auto px-6 pt-24 pb-28 md:pt-32">
        <p className="rv-serif italic text-center text-[32px] md:text-[38px] leading-[1.1] text-[#14161a] mb-2">
          All Reviews
        </p>
        <p className="text-center text-[10px] uppercase tracking-[0.24em] text-[#14161a]/40 mb-16">
          {loading ? 'Loading…' : `${reviews.length} live — reviews publish automatically`}
        </p>

        {!loading && reviews.length === 0 && (
          <p className="text-center text-[13px] uppercase tracking-[0.2em] text-[#14161a]/40 py-10">
            No reviews yet.
          </p>
        )}

        <ul className="divide-y divide-[#14161a]/10">
          {reviews.map((review) => (
            <li key={review.id} className="py-8">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <p className="rv-serif italic text-[18px] text-[#14161a]">{review.name}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-[#14161a]/40">
                    {review.product_id} — {review.email}
                  </p>
                </div>
                <Stars rating={review.rating} />
              </div>

              <p className="text-[14px] leading-[1.8] text-[#14161a]/75 mb-5">
                {review.text}
              </p>

              <button
                onClick={() => handleDelete(review.id)}
                className="text-[11px] uppercase tracking-[0.2em] text-[#14161a]/45 border-b border-[#14161a]/20 pb-0.5 hover:text-[var(--rv-navy)] hover:border-[var(--rv-navy)] transition"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
