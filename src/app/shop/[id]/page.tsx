import type { Metadata } from 'next';
import { sanityClient } from '../../../lib/sanity';
import ProductDetailsClient from './ProductDetailsClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ryvol.shop';

const PRODUCT_QUERY = `
  *[_type == "product" && id.current == $id && available == true][0] {
    "id": id.current,
    name,
    price,
    description,
    details,
    soldOut,
    stock,
    category,
    "imageFront": imageFront.asset->url,
    "imageBack": imageBack.asset->url,
    "modelFront": modelFront.asset->url,
    "modelBack": modelBack.asset->url,
    "flatLayFront": flatLayFront.asset->url,
    "flatLayBack": flatLayBack.asset->url,
    "images": images[]{
      "url": image.asset->url,
      label
    },
    sizeChart,
  }
`;

interface Stock {
  XS: number;
  S: number;
  M: number;
  L: number;
  XL: number;
  XXL: number;
  oneSize: number;
}

interface SizeChartRow {
  size: string;
  width: string;
  length: string;
}

// Mirrors ProductDetailsClient's own `Product` interface (not exported
// from there, so duplicated here) — needs to match exactly since the same
// fetched object gets passed straight into that component below.
interface SanityProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  details?: string;
  soldOut: boolean;
  stock: Stock;
  category: string;
  imageFront?: string;
  imageBack?: string;
  modelFront?: string;
  modelBack?: string;
  flatLayFront?: string;
  flatLayBack?: string;
  images?: { url: string; label: string }[];
  sizeChart: SizeChartRow[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product: SanityProduct | null = await sanityClient.fetch(PRODUCT_QUERY, { id });

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const description =
    product.description?.trim() ||
    `${product.name}: $${product.price.toFixed(2)}. Coastal luxury apparel from RYVOL.`;
  const image = product.imageFront || product.images?.[0]?.url;

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      url: `${SITE_URL}/shop/${product.id}`,
      images: image ? [{ url: image }] : undefined,
      type: 'website',
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: product.name,
      description,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product: SanityProduct | null = await sanityClient.fetch(PRODUCT_QUERY, { id });

  if (!product) return <div className="p-10 text-center text-red-500">Product not found</div>;

  const image = product.imageFront || product.images?.[0]?.url;

  // Product structured data — this is what lets Google (and shopping
  // surfaces that read the same schema.org vocabulary) show price and
  // in-stock/out-of-stock status directly in search results instead of
  // just a plain blue link.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || undefined,
    image: image ? [image] : undefined,
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/shop/${product.id}`,
      priceCurrency: 'USD',
      price: product.price,
      availability: product.soldOut
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailsClient product={product} />
    </>
  );
}
