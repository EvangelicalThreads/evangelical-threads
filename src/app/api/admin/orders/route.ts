import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Every order, most recent first — pending ones included, so a session
// that got created but never actually completed payment is still visible
// rather than silently invisible.
export async function GET() {
  try {
    const orders = await prisma.orders.findMany({
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json({ orders });
  } catch (err) {
    console.error('GET /api/admin/orders error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
