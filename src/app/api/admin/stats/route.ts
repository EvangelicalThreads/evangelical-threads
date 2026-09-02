import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Powers the numbers at the top of /admin — a quick "how's the store doing"
// snapshot without having to click into Orders/Reviews individually.
export async function GET() {
  try {
    const [totalOrders, pendingOrders, paidOrders, paidAgg, pendingReviews] =
      await Promise.all([
        prisma.orders.count(),
        prisma.orders.count({ where: { status: 'pending' } }),
        prisma.orders.count({ where: { status: 'paid' } }),
        prisma.orders.aggregate({
          where: { status: 'paid' },
          _sum: { amount_total: true },
        }),
        prisma.reviews.count({ where: { is_approved: false } }),
      ]);

    return NextResponse.json({
      totalOrders,
      pendingOrders,
      paidOrders,
      totalRevenueCents: paidAgg._sum.amount_total ?? 0,
      pendingReviews,
    });
  } catch (err) {
    console.error('GET /api/admin/stats error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
