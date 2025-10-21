import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

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
      },
    });

    console.log(`Order updated for session ${session.id}`);

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Stripe webhook error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
