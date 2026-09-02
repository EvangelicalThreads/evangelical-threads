import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { sendNewSaleEmail } from '@/lib/resend';

export const config = { api: { bodyParser: false } };

const prisma = new PrismaClient();

export async function POST(req: Request) {
  let session: Stripe.Checkout.Session | undefined;

  try {
    if (process.env.NODE_ENV === 'development') {
      // Local testing: parse JSON directly
      const body = await req.json();
      session = body.data?.object as Stripe.Checkout.Session;
    } else {
      // Production: verify webhook signature
      const buf = Buffer.from(await req.arrayBuffer());
      const sig = req.headers.get('stripe-signature');

      if (!sig) throw new Error('Missing Stripe signature');

      const event = stripe.webhooks.constructEvent(
        buf,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      if (event.type === 'checkout.session.completed') {
        session = event.data.object as Stripe.Checkout.Session;
      }
    }

    if (!session) {
      return NextResponse.json({ error: 'No session found' }, { status: 400 });
    }

    // Extract customer/shipping details safely
    const details = session.customer_details;

    // Grabbed before the update so we can tell whether this is a genuinely
    // new "paid" transition or a duplicate webhook delivery for a session
    // Stripe already told us about — Stripe's docs are explicit that
    // events can be delivered more than once, and without this check a
    // resent event would double-count a promo code's usage.
    const existingOrder = await prisma.orders.findFirst({
      where: { stripe_session_id: session.id! },
      orderBy: { created_at: 'desc' },
    });
    const alreadyPaid = existingOrder?.status === 'paid';

    await prisma.orders.updateMany({
      where: { stripe_session_id: session.id! },
      data: {
        name: details?.name ?? '',
        address: details?.address?.line1 ?? '',
        city: details?.address?.city ?? '',
        state: details?.address?.state ?? '',
        postal_code: details?.address?.postal_code ?? '',
        country: details?.address?.country ?? '',
        status: 'paid',
        email: details?.email ?? null,
        amount_total: session.amount_total ?? null,
      },
    });

    console.log(`Order updated for session ${session.id}`);

    // Best-effort "new sale" alert — same pattern as the review
    // notification email. Read the order back rather than trusting the
    // updateMany payload directly, since it already holds the item list
    // written at checkout-session creation time. A flaky email send must
    // never make this webhook look like it failed to Stripe (that would
    // trigger retries) when the order itself was already saved correctly.
    try {
      const order = await prisma.orders.findFirst({
        where: { stripe_session_id: session.id! },
        orderBy: { created_at: 'desc' },
      });
      if (order) {
        await sendNewSaleEmail({
          name: order.name,
          email: order.email,
          address: order.address,
          city: order.city,
          state: order.state,
          postal_code: order.postal_code,
          country: order.country,
          amountTotal: order.amount_total,
          items: order.items as
            | { name: string; size?: string; quantity: number; price: number }[]
            | null,
        });
      }
    } catch (notifyErr) {
      console.error('New sale email failed:', notifyErr);
    }

    // Count the promo code's usage now that the order has genuinely gone
    // through — not at checkout-session creation, since most sessions
    // that get created are abandoned and never actually pay.
    if (!alreadyPaid && existingOrder?.promo_code) {
      try {
        await prisma.promo_codes.update({
          where: { code: existingOrder.promo_code },
          data: { uses_count: { increment: 1 } },
        });
      } catch (promoErr) {
        console.error('Promo code usage increment failed:', promoErr);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Stripe webhook error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
