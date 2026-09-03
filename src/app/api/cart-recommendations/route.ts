import { NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';

// Backs the cart's "Complete the Drop" recommendation (see
// COMPLETE_THE_DROP_MAP in Navbar.tsx). Fetched server-side, on demand,
// rather than from the client directly — keeps the client cart from
// depending on Sanity's API being reachable/CORS-open from the browser.
const RECOMMENDATION_IDS = ['dolphin-tee', 'ringer-tee', 'current-tote'];

const QUERY = `
  *[_type == "product" && id.current in $ids] {
    "id": id.current,
    name,
    price,
    soldOut,
    category,
    "imageFront": imageFront.asset->url,
    "images": images[]{ "url": image.asset->url },
  }
`;

interface RawProduct {
  id: string;
  name: string;
  price: number;
  soldOut: boolean;
  category: string;
  imageFront?: string;
  images?: { url: string }[];
}

export async function GET() {
  try {
    const products: RawProduct[] = await sanityClient.fetch(QUERY, { ids: RECOMMENDATION_IDS });
    const shaped = products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      soldOut: p.soldOut,
      category: p.category,
      image: p.category === 'apparel' ? p.imageFront : p.images?.[0]?.url,
    }));
    return NextResponse.json({ products: shaped });
  } catch (error) {
    console.error('cart-recommendations fetch failed:', error);
    // Best-effort — the cart works fine without a recommendation.
    return NextResponse.json({ products: [] });
  }
}
