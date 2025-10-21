import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

interface CartItem {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { cartItems } = (await req.json()) as { cartItems: CartItem[] };

    if (!cartItems || !Array.isArray(cartItems)) {
      return NextResponse.json({ error: 'Invalid cart items' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'https://yourdomain.com';

    // 1️⃣ Create Stripe checkout session with shipping address collection
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [`${origin}/products/${item.image}`],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'], // add more countries if needed
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
    });

    // 2️⃣ Store initial order in your DB with "pending" status
    await prisma.orders.create({
      data: {
        stripe_session_id: session.id,
        name: '', // will fill after webhook
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
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
