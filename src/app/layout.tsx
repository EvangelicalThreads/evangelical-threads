import './globals.css';
import type { Metadata } from 'next';
import { Cormorant_Garamond } from 'next/font/google';
import RootLayoutClient from '../components/RootLayoutClient';

// Editorial serif for headlines/pull-quotes only — nav, labels, and body
// copy stay on the existing sans. Exposed as --font-serif; see the
// `.rv-serif` utility in globals.css.
const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['italic', 'normal'],
  variable: '--font-serif',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ryvol.shop';
const SITE_DESCRIPTION =
  'RYVOL — coastal luxury apparel. Unryvoled Pursuit. Shop tees, totes, and more built for the water, the shore, and everywhere after.';

// This is the one place site-wide SEO tags live — every page inherits this
// unless it sets its own (product pages do, via generateMetadata). This
// file has to be a server component for `metadata` to work at all, which
// is why all the interactive stuff (cart, session, cookie banner) now
// lives in RootLayoutClient instead of here.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'RYVOL — Coastal Luxury Apparel',
    template: '%s | RYVOL',
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: 'RYVOL',
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: 'RYVOL',
    images: [{ url: '/brand/ryvol-emblem-navy.png', width: 512, height: 512, alt: 'RYVOL' }],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'RYVOL',
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: '/brand/ryvol-emblem-navy.png',
  },
  // Proves to Google you own the site — needed because the Analytics
  // verification method doesn't work here (GA is deliberately gated
  // behind cookie consent, so Google's checker never sees it in the raw
  // page source). This tag is unconditional, so it works regardless.
  verification: {
    google: 'C3r4ZrU0K7iEtILvF31vbBiOcrByxJ2ri_q9EvilOOk',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={serif.variable}>
      <body className="min-h-screen overflow-x-hidden bg-[#F2F0EB] text-[#14161a]">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
