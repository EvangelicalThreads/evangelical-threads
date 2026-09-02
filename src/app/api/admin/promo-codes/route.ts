import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const VALID_TYPES = ['percent', 'fixed', 'free_shipping'];

export async function GET() {
  try {
    const codes = await prisma.promo_codes.findMany({
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json({ codes });
  } catch (err) {
    console.error('GET /api/admin/promo-codes error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { code, type, value, maxUses, expiresAt } = await req.json();

    if (!code || typeof code !== 'string' || !code.trim()) {
      return NextResponse.json({ error: 'Missing code' }, { status: 400 });
    }
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
    const numericValue = Number(value);
    if (type !== 'free_shipping') {
      if (!Number.isFinite(numericValue) || numericValue <= 0) {
        return NextResponse.json({ error: 'Value must be a positive number' }, { status: 400 });
      }
      if (type === 'percent' && numericValue > 100) {
        return NextResponse.json({ error: 'Percent off cannot exceed 100' }, { status: 400 });
      }
    }

    const created = await prisma.promo_codes.create({
      data: {
        code: code.trim().toUpperCase(),
        type,
        value: type === 'free_shipping' ? 0 : numericValue,
        max_uses: maxUses ? Number(maxUses) : null,
        expires_at: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json({ code: created });
  } catch (err: unknown) {
    // Unique constraint on `code` — friendlier message than a raw DB error.
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code?: string }).code === 'P2002'
    ) {
      return NextResponse.json({ error: 'That code already exists' }, { status: 409 });
    }
    console.error('POST /api/admin/promo-codes error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
