import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

interface CartItem {
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
}

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { cartItems } = (await req.json()) as { cartItems: CartItem[] };

    if (!cartItems || !Array.isArray(cartItems)) {
      return NextResponse.json({ error: 'Invalid cart items' }, { status: 400 });
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://www.evangelicalthreads.com';

    console.log('cartItems received:', cartItems);
    console.log(
      'Stripe image URLs:',
      cartItems.map((item) => `${siteUrl}${item.image}`)
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.size ? `${item.name} (Size: ${item.size})` : item.name,
            images: [`${siteUrl}${item.image}`],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,
    });

    await prisma.orders.create({
      data: {
        stripe_session_id: session.id,
        name: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        status: 'pending',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}