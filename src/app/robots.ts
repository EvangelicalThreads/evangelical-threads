import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ryvol.shop';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Nothing here is content anyone should land on from a search
      // result — account pages, checkout/cart flow, and anything
      // admin/API. Keeping these out of the index also keeps them out of
      // "site:ryvol.shop" results, which is what you'd actually want
      // customers to see.
      disallow: [
        '/admin',
        '/admin/',
        '/api/',
        '/checkout',
        '/success',
        '/thank-you',
        '/login',
        '/reset-password',
        '/reset-password/',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
