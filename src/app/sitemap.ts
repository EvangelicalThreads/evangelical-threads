import type { MetadataRoute } from 'next';
import { sanityClient } from '@/lib/sanity';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ryvol.shop';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Only list products that are actually live — a sold-out item still
  // counts (it's real content worth indexing), a hidden/unavailable one
  // doesn't.
  const products: { id: string; _updatedAt: string }[] = await sanityClient.fetch(
    `*[_type == "product" && available == true] { "id": id.current, _updatedAt }`
  );

  const productEntries: MetadataRoute.Sitemap = products
    .filter((p) => p.id)
    .map((p) => ({
      url: `${SITE_URL}/shop/${p.id}`,
      lastModified: p._updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  return [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/shop`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/faq`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/reviews`, changeFrequency: 'weekly', priority: 0.5 },
    ...productEntries,
  ];
}
