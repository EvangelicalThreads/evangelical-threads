'use client';

import { useEffect, useState } from 'react';

interface OrderItem {
  name: string;
  size?: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  status: string;
  email: string | null;
  amount_total: number | null;
  items: OrderItem[] | null;
  shipped: boolean;
  tracking_number: string | null;
  carrier: string | null;
  shipped_at: string | null;
  created_at: string;
}

function money(cents: number | null) {
  if (cents == null) return '—';
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function ShipForm({ order, onShipped }: { order: Order; onShipped: () => void }) {
  const [tracking, setTracking] = useState('');
  const [carrier, setCarrier] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleShip = async () => {
    setSubmitting(true);
    try {
      await fetch('/api/admin/orders/ship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: order.id, trackingNumber: tracking, carrier }),
      });
      onShipped();
    } catch (err) {
      console.error('Ship order error:', err);
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-5 pt-5 border-t border-[#14161a]/10 flex flex-wrap items-center gap-2.5">
      <input
        value={carrier}
        onChange={(e) => setCarrier(e.target.value)}
        placeholder="Carrier (optional)"
        className="w-[140px] border border-[#14161a]/20 bg-transparent px-3 py-2 text-[12px] text-[#14161a] placeholder:text-[#14161a]/35 focus:outline-none focus:border-[#14161a]/50"
      />
      <input
        value={tracking}
        onChange={(e) => setTracking(e.target.value)}
        placeholder="Tracking number (optional)"
        className="flex-1 min-w-[180px] border border-[#14161a]/20 bg-transparent px-3 py-2 text-[12px] text-[#14161a] placeholder:text-[#14161a]/35 focus:outline-none focus:border-[#14161a]/50"
      />
      <button
        onClick={handleShip}
        disabled={submitting}
        className="shrink-0 bg-[#14161a] text-[#F2F0EB] px-5 py-2 text-[10px] uppercase tracking-[0.24em] hover:bg-[var(--rv-navy)] transition disabled:opacity-50"
      >
        {submitting ? 'Marking…' : 'Mark Shipped'}
      </button>
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <main className="bg-[#F2F0EB] min-h-screen text-[#14161a]">
      <div className="max-w-[760px] mx-auto px-6 pt-24 pb-28 md:pt-32">
        <p className="rv-serif italic text-center text-[32px] md:text-[38px] leading-[1.1] text-[#14161a] mb-2">
          Orders
        </p>
        <p className="text-center text-[10px] uppercase tracking-[0.24em] text-[#14161a]/40 mb-16">
          {loading ? 'Loading…' : `${orders.length} total`}
        </p>

        {!loading && orders.length === 0 && (
          <p className="text-center text-[13px] uppercase tracking-[0.2em] text-[#14161a]/40 py-10">
            No orders yet.
          </p>
        )}

        <ul className="divide-y divide-[#14161a]/10">
          {orders.map((order) => (
            <li key={order.id} className="py-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="rv-serif italic text-[19px] text-[#14161a]">
                    {order.name || 'Unnamed order'}
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-[#14161a]/40">
                    {formatDate(order.created_at)}
                    {order.email ? ` — ${order.email}` : ''}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span
                    className={`text-[9px] uppercase tracking-[0.2em] px-2 py-1 ${
                      order.status === 'paid'
                        ? 'bg-[#EDEAE3] text-[#14161a]/70'
                        : 'bg-[#F2F0EB] border border-[#14161a]/20 text-[#14161a]/45'
                    }`}
                  >
                    {order.status}
                  </span>
                  {order.shipped && (
                    <span className="text-[9px] uppercase tracking-[0.2em] px-2 py-1 bg-[var(--rv-navy)] text-[#F2F0EB]">
                      Shipped
                    </span>
                  )}
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="text-[13px] leading-[1.9] text-[#14161a]/75 mb-3">
                  {order.items.map((item, i) => (
                    <div key={i}>
                      {item.quantity}× {item.name}
                      {item.size ? ` (${item.size})` : ''} — ${item.price.toFixed(2)}
                    </div>
                  ))}
                </div>
              )}

              <p className="text-[12px] text-[#14161a]/55 mb-1">
                {order.address ? (
                  <>
                    {order.address}, {order.city}, {order.state} {order.postal_code},{' '}
                    {order.country}
                  </>
                ) : (
                  'No shipping address yet'
                )}
              </p>

              <p className="text-[12px] text-[#14161a]/55">
                Total: <span className="text-[#14161a]">{money(order.amount_total)}</span>
              </p>

              {order.shipped ? (
                <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-[#14161a]/40">
                  Shipped {order.shipped_at ? formatDate(order.shipped_at) : ''}
                  {order.tracking_number
                    ? ` — ${order.carrier ? `${order.carrier} ` : ''}${order.tracking_number}`
                    : ''}
                </p>
              ) : order.status === 'paid' ? (
                <ShipForm order={order} onShipped={refresh} />
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
