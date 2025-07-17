import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

interface CartItem {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export async function POST(req: Request) {
  try {
    const { cartItems } = await req.json() as { cartItems: CartItem[] };

    if (!cartItems || !Array.isArray(cartItems)) {
      return NextResponse.json(
        { error: 'Invalid cart items' },
        { status: 400 }
      );
    }

    const origin = req.headers.get('origin') || 'https://yourdomain.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [`${origin}/products/${item.image}`], // full URL
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      success_url: `${origin}/success`,
      cancel_url: `${origin}/checkout`,
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
