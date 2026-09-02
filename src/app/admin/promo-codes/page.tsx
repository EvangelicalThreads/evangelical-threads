'use client';

import { useEffect, useState } from 'react';

interface PromoCode {
  id: string;
  code: string;
  type: 'percent' | 'fixed' | 'free_shipping';
  value: number;
  active: boolean;
  max_uses: number | null;
  uses_count: number;
  expires_at: string | null;
  created_at: string;
}

function describeCode(c: PromoCode) {
  if (c.type === 'percent') return `${c.value}% off`;
  if (c.type === 'fixed') return `$${c.value.toFixed(2)} off`;
  return 'Free shipping';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function PromoCodesPage() {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);

  const [code, setCode] = useState('');
  const [type, setType] = useState<'percent' | 'fixed' | 'free_shipping'>('percent');
  const [value, setValue] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const refresh = async () => {
    try {
      const res = await fetch('/api/admin/promo-codes');
      const data = await res.json();
      setCodes(data.codes || []);
    } catch (err) {
      console.error('Fetch promo codes error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!code.trim()) {
      setFormError('Enter a code.');
      return;
    }
    if (type !== 'free_shipping' && (!value || Number(value) <= 0)) {
      setFormError('Enter a value greater than 0.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/promo-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim(),
          type,
          value: type === 'free_shipping' ? 0 : Number(value),
          maxUses: maxUses ? Number(maxUses) : undefined,
          expiresAt: expiresAt || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Something went wrong.');
        return;
      }
      setCode('');
      setValue('');
      setMaxUses('');
      setExpiresAt('');
      await refresh();
    } catch {
      setFormError('Something went wrong — try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (c: PromoCode) => {
    try {
      await fetch(`/api/admin/promo-codes/${c.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !c.active }),
      });
      await refresh();
    } catch (err) {
      console.error('Toggle promo code error:', err);
    }
  };

  const remove = async (c: PromoCode) => {
    try {
      await fetch(`/api/admin/promo-codes/${c.id}`, { method: 'DELETE' });
      await refresh();
    } catch (err) {
      console.error('Delete promo code error:', err);
    }
  };

  return (
    <main className="bg-[#F2F0EB] min-h-screen text-[#14161a]">
      <div className="max-w-[640px] mx-auto px-6 pt-24 pb-28 md:pt-32">
        <p className="rv-serif italic text-center text-[32px] md:text-[38px] leading-[1.1] text-[#14161a] mb-2">
          Promo Codes
        </p>
        <p className="text-center text-[10px] uppercase tracking-[0.24em] text-[#14161a]/40 mb-16">
          {loading ? 'Loading…' : `${codes.length} total`}
        </p>

        <form onSubmit={handleCreate} className="mb-16 pb-12 border-b border-[#14161a]/10">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#14161a]/45 mb-5">New Code</p>
          <div className="flex flex-wrap gap-2.5 mb-3">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="CODE (e.g. WELCOME10)"
              className="flex-1 min-w-[160px] border border-[#14161a]/20 bg-transparent px-3 py-2.5 text-[13px] text-[#14161a] placeholder:text-[#14161a]/35 focus:outline-none focus:border-[#14161a]/50"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
              className="border border-[#14161a]/20 bg-[#F2F0EB] px-3 py-2.5 text-[13px] text-[#14161a] focus:outline-none focus:border-[#14161a]/50"
            >
              <option value="percent">% off</option>
              <option value="fixed">$ off</option>
              <option value="free_shipping">Free shipping</option>
            </select>
            {type !== 'free_shipping' && (
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                type="number"
                min="0"
                step="0.01"
                placeholder={type === 'percent' ? '10' : '5.00'}
                className="w-[100px] border border-[#14161a]/20 bg-transparent px-3 py-2.5 text-[13px] text-[#14161a] placeholder:text-[#14161a]/35 focus:outline-none focus:border-[#14161a]/50"
              />
            )}
          </div>
          <div className="flex flex-wrap gap-2.5 mb-4">
            <input
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              type="number"
              min="1"
              placeholder="Max uses (optional)"
              className="flex-1 min-w-[160px] border border-[#14161a]/20 bg-transparent px-3 py-2.5 text-[13px] text-[#14161a] placeholder:text-[#14161a]/35 focus:outline-none focus:border-[#14161a]/50"
            />
            <input
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              type="date"
              className="border border-[#14161a]/20 bg-transparent px-3 py-2.5 text-[13px] text-[#14161a] focus:outline-none focus:border-[#14161a]/50"
            />
          </div>
          {formError && <p className="text-[12px] text-[var(--rv-navy)] mb-4">{formError}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#14161a] text-[#F2F0EB] px-6 py-2.5 text-[10px] uppercase tracking-[0.24em] hover:bg-[var(--rv-navy)] transition disabled:opacity-50"
          >
            {submitting ? 'Creating…' : 'Create Code'}
          </button>
        </form>

        {!loading && codes.length === 0 && (
          <p className="text-center text-[13px] uppercase tracking-[0.2em] text-[#14161a]/40 py-10">
            No promo codes yet.
          </p>
        )}

        <ul className="divide-y divide-[#14161a]/10">
          {codes.map((c) => {
            const expired = c.expires_at ? new Date(c.expires_at) < new Date() : false;
            const exhausted = c.max_uses != null && c.uses_count >= c.max_uses;
            return (
              <li key={c.id} className="py-6 flex items-start justify-between gap-4">
                <div>
                  <p className="rv-serif italic text-[19px] text-[#14161a]">{c.code}</p>
                  <p className="mt-0.5 text-[12px] text-[#14161a]/55">{describeCode(c)}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#14161a]/40">
                    {c.uses_count} used{c.max_uses != null ? ` / ${c.max_uses}` : ''}
                    {c.expires_at ? ` — expires ${formatDate(c.expires_at)}` : ''}
                    {expired ? ' — EXPIRED' : ''}
                    {exhausted ? ' — LIMIT REACHED' : ''}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                    className={`text-[9px] uppercase tracking-[0.2em] px-2 py-1 ${
                      c.active && !expired && !exhausted
                        ? 'bg-[#EDEAE3] text-[#14161a]/70'
                        : 'bg-[#F2F0EB] border border-[#14161a]/20 text-[#14161a]/45'
                    }`}
                  >
                    {c.active ? 'Active' : 'Off'}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleActive(c)}
                      className="text-[10px] uppercase tracking-[0.16em] text-[#14161a]/50 hover:text-[#14161a] transition"
                    >
                      {c.active ? 'Turn Off' : 'Turn On'}
                    </button>
                    <button
                      onClick={() => remove(c)}
                      className="text-[10px] uppercase tracking-[0.16em] text-[#14161a]/50 hover:text-[var(--rv-navy)] transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
