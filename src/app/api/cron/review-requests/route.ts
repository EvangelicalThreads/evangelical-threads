import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendReviewRequestEmail } from '@/lib/resend';

const DAYS_AFTER_SHIPPING = 7;

// Runs once a day (see vercel.json) and emails anyone whose order shipped
// a week ago and hasn't already gotten this email. Marks each order as
// requested right after a successful send so a re-run (or a slow/retried
// cron invocation) can never double-send.
export async function GET(req: NextRequest) {
  // Vercel sets this header automatically on real cron invocations when
  // CRON_SECRET is set in your Vercel project's environment variables —
  // add that env var there so random requests to this URL can't trigger a
  // batch of customer emails. Without CRON_SECRET set, this check is
  // skipped (so it still works before you've added it), but it's worth
  // adding.
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const cutoff = new Date(Date.now() - DAYS_AFTER_SHIPPING * 24 * 60 * 60 * 1000);

    const orders = await prisma.orders.findMany({
      where: {
        status: 'paid',
        shipped: true,
        shipped_at: { lte: cutoff },
        review_requested_at: null,
        email: { not: null },
      },
    });

    let sent = 0;
    for (const order of orders) {
      try {
        await sendReviewRequestEmail({
          email: order.email!,
          name: order.name,
          items: order.items as { id?: string; name: string }[] | null,
        });
        await prisma.orders.update({
          where: { id: order.id },
          data: { review_requested_at: new Date() },
        });
        sent++;
      } catch (err) {
        // One bad send (bounced address, transient Resend error) shouldn't
        // stop the rest of the batch from going out.
        console.error(`Review request email failed for order ${order.id}:`, err);
      }
    }

    return NextResponse.json({ checked: orders.length, sent });
  } catch (err) {
    console.error('GET /api/cron/review-requests error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
