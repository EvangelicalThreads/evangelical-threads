import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendShippingEmail } from '@/lib/resend';

// Marks an order shipped and — best-effort, same pattern as the review
// notification email — fires the "your order is on its way" email. The
// order is marked shipped either way; a flaky email send should never
// make this action look like it failed when the important part (your
// own record of the order being shipped) already succeeded.
export async function POST(req: NextRequest) {
  try {
    const { id, trackingNumber, carrier } = await req.json();

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Missing order id' }, { status: 400 });
    }

    const order = await prisma.orders.update({
      where: { id },
      data: {
        shipped: true,
        shipped_at: new Date(),
        tracking_number: trackingNumber || null,
        carrier: carrier || null,
      },
    });

    if (order.email) {
      try {
        await sendShippingEmail({
          email: order.email,
          name: order.name,
          trackingNumber: order.tracking_number ?? undefined,
          carrier: order.carrier ?? undefined,
        });
      } catch (notifyErr) {
        console.error('Shipping email failed:', notifyErr);
      }
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error('POST /api/admin/orders/ship error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
