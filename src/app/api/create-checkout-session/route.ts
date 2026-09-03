import { stripe } from '@/lib/stripe';
import { sanityClient } from '@/lib/sanity';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
}

interface SanityProduct {
  id: string;
  name: string;
  price: number;
  soldOut: boolean;
  imageFront: string;
}

const prisma = new PrismaClient();

// Keep in sync with FREE_SHIPPING_THRESHOLD in src/components/Navbar.tsx.
const FREE_SHIPPING_THRESHOLD = 50;
// Flat rate charged when the order is under the threshold — arbitrary
// placeholder, change to whatever you actually want to charge.
const FLAT_SHIPPING_RATE = 6.95;

export async function POST(req: Request) {
  try {
    const { cartItems, promoCode } = (await req.json()) as {
      cartItems: CartItem[];
      promoCode?: string;
    };

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: 'Invalid cart items' }, { status: 400 });
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ryvol.shop';

    // Never trust price/name off the client — look every item up in Sanity
    // (the real source of truth) so a tampered request body can't be used
    // to check out at a manipulated price or buy something that's sold out.
    const ids = [...new Set(cartItems.map((item) => item.id))];
    const products: SanityProduct[] = await sanityClient.fetch(
      `*[_type == "product" && id.current in $ids] {
        "id": id.current,
        name,
        price,
        soldOut,
        "imageFront": imageFront.asset->url,
      }`,
      { ids }
    );
    const productById = new Map(products.map((p) => [p.id, p]));

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    // A plain snapshot of what was actually ordered — stored on the order
    // now, while we have the validated (not client-trusted) product data
    // in hand, so /admin/orders can show line items without needing to
    // re-fetch anything from Stripe later.
    const orderedItems: { id: string; name: string; size?: string; quantity: number; price: number }[] = [];
    let subtotal = 0;

    for (const item of cartItems) {
      const product = productById.get(item.id);

      if (!product) {
        return NextResponse.json(
          { error: `Item no longer available: ${item.name}` },
          { status: 400 }
        );
      }
      if (product.soldOut) {
        return NextResponse.json(
          { error: `${product.name} is sold out` },
          { status: 400 }
        );
      }

      const quantity = Math.max(1, Math.floor(item.quantity) || 1);
      subtotal += product.price * quantity;

      orderedItems.push({
        id: product.id,
        name: product.name,
        ...(item.size ? { size: item.size } : {}),
        quantity,
        price: product.price,
      });

      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.size ? `${product.name} (Size: ${item.size})` : product.name,
            images: [`${siteUrl}${product.imageFront || item.image}`],
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity,
      });
    }

    let freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
    let appliedPromoCode: string | null = null;

    // Promo codes are entirely custom (Stripe's own coupon/promo system
    // can't touch shipping, and we want one field that handles both
    // percent/dollar-off AND free-shipping codes) — validated here against
    // our own table rather than anything in Stripe's dashboard.
    if (promoCode && typeof promoCode === 'string' && promoCode.trim()) {
      const normalized = promoCode.trim().toUpperCase();
      const promo = await prisma.promo_codes.findUnique({ where: { code: normalized } });

      if (!promo) {
        return NextResponse.json({ error: 'Invalid promo code' }, { status: 400 });
      }
      if (!promo.active) {
        return NextResponse.json({ error: 'This promo code is no longer active' }, { status: 400 });
      }
      if (promo.expires_at && promo.expires_at < new Date()) {
        return NextResponse.json({ error: 'This promo code has expired' }, { status: 400 });
      }
      if (promo.max_uses != null && promo.uses_count >= promo.max_uses) {
        return NextResponse.json({ error: 'This promo code has reached its usage limit' }, { status: 400 });
      }

      appliedPromoCode = normalized;

      if (promo.type === 'free_shipping') {
        freeShipping = true;
      } else if (promo.type === 'percent') {
        const coupon = await stripe.coupons.create({
          percent_off: promo.value,
          duration: 'once',
          name: normalized,
        });
        discounts = [{ coupon: coupon.id }];
      } else if (promo.type === 'fixed') {
        // Stripe coupons can't discount more than the subtotal — cap it so
        // a $20-off code on a $5 order doesn't error out the session.
        const amountOff = Math.min(Math.round(promo.value * 100), Math.round(subtotal * 100));
        const coupon = await stripe.coupons.create({
          amount_off: amountOff,
          currency: 'usd',
          duration: 'once',
          name: normalized,
        });
        discounts = [{ coupon: coupon.id }];
      }
    }

    console.log('Validated line items:', line_items);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      ...(discounts ? { discounts } : {}),
      // EMERGENCY REVERT (see prior commit "Add native Stripe checkbox for
      // email marketing consent at checkout"): consent_collection.promotions
      // started throwing on stripe.checkout.sessions.create and took
      // checkout down entirely. Pulled out to restore checkout immediately.
      // The webhook's read of session.consent?.promotions is left in place
      // — harmless no-op now, ready to reinstate once the real cause here
      // is confirmed from the Stripe error text.
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: freeShipping ? 0 : Math.round(FLAT_SHIPPING_RATE * 100),
              currency: 'usd',
            },
            display_name: freeShipping ? 'Free Shipping' : 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 4 },
              maximum: { unit: 'business_day', value: 8 },
            },
          },
        },
      ],
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
        items: orderedItems,
        promo_code: appliedPromoCode,
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
