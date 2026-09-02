import { NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';

// Meta Commerce Manager re-pulls this URL on its own schedule once it's
// set as the catalog's data source — no need to regenerate on every
// single hit, so this can sit statically for a while between requests.
export const revalidate = 3600;

const BRAND = 'RYVOL';

interface Stock {
  XS?: number;
  S?: number;
  M?: number;
  L?: number;
  XL?: number;
  XXL?: number;
  oneSize?: number;
}

interface SanityProduct {
  id: string;
  name: string;
  price: number;
  description?: string;
  category: string;
  soldOut: boolean;
  stock?: Stock;
  imageFront?: string;
  imageBack?: string;
  images?: { url: string }[];
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const sizeLabels: { key: keyof Stock; label: string }[] = [
  { key: 'XS', label: 'XS' },
  { key: 'S', label: 'S' },
  { key: 'M', label: 'M' },
  { key: 'L', label: 'L' },
  { key: 'XL', label: 'XL' },
  { key: 'XXL', label: '2XL' },
];

// Standard Google-Shopping-style product feed (the same XML shape Google
// Merchant Center and Meta Commerce Manager both read) — point the
// catalog's Data Source at this URL so Meta re-pulls it automatically and
// products/prices/stock here always match what's actually live on the
// site, instead of anyone re-adding items by hand in Commerce Manager.
export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ryvol.shop';

  const products: SanityProduct[] = await sanityClient.fetch(`
    *[_type == "product" && available == true] {
      "id": id.current,
      name,
      price,
      description,
      category,
      soldOut,
      stock,
      "imageFront": imageFront.asset->url,
      "imageBack": imageBack.asset->url,
      "images": images[]{ "url": image.asset->url },
    }
  `);

  const items: string[] = [];

  for (const product of products) {
    const isApparel = product.category === 'apparel';
    const link = `${siteUrl}/shop/${product.id}`;
    const image =
      (isApparel ? product.imageFront : product.images?.[0]?.url) || product.imageFront || '';
    const additionalImage = isApparel ? product.imageBack : product.images?.[1]?.url;
    const description = escapeXml(product.description || product.name);
    const title = escapeXml(product.name);
    const productType = escapeXml(
      product.category.charAt(0).toUpperCase() + product.category.slice(1)
    );

    // Meta rejects feed items with no image outright — skip rather than
    // submit something guaranteed to fail ingestion.
    if (!image) continue;

    if (isApparel && product.stock) {
      // One feed item per size actually in stock, sharing an
      // item_group_id — lets Meta/Instagram show a real size selector on
      // the product instead of one lumped "apparel" listing.
      for (const { key, label } of sizeLabels) {
        const qty = product.stock[key] ?? 0;
        if (product.soldOut || qty <= 0) continue;
        items.push(`
    <item>
      <g:id>${product.id}-${key.toLowerCase()}</g:id>
      <g:item_group_id>${product.id}</g:item_group_id>
      <g:title>${title} (${label})</g:title>
      <g:description>${description}</g:description>
      <g:link>${link}</g:link>
      <g:image_link>${image}</g:image_link>
      ${additionalImage ? `<g:additional_image_link>${additionalImage}</g:additional_image_link>` : ''}
      <g:availability>in stock</g:availability>
      <g:price>${product.price.toFixed(2)} USD</g:price>
      <g:brand>${BRAND}</g:brand>
      <g:condition>new</g:condition>
      <g:product_type>${productType}</g:product_type>
      <g:size>${label}</g:size>
    </item>`);
      }
    } else {
      const qty = product.stock?.oneSize;
      const inStock = !product.soldOut && (qty === undefined || qty > 0);
      items.push(`
    <item>
      <g:id>${product.id}</g:id>
      <g:title>${title}</g:title>
      <g:description>${description}</g:description>
      <g:link>${link}</g:link>
      <g:image_link>${image}</g:image_link>
      ${additionalImage ? `<g:additional_image_link>${additionalImage}</g:additional_image_link>` : ''}
      <g:availability>${inStock ? 'in stock' : 'out of stock'}</g:availability>
      <g:price>${product.price.toFixed(2)} USD</g:price>
      <g:brand>${BRAND}</g:brand>
      <g:condition>new</g:condition>
      <g:product_type>${productType}</g:product_type>
    </item>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${BRAND} Product Catalog</title>
    <link>${siteUrl}</link>
    <description>Live product feed for Meta Commerce Manager</description>
    ${items.join('')}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
