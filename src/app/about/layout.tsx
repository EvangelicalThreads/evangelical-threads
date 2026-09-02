import type { Metadata } from 'next';

// page.tsx here is a client component ('use client'), and Next.js only
// allows `metadata` exports from server components — this small wrapper is
// the standard way to attach SEO tags to a client page without having to
// refactor its interactivity out into a separate component.
export const metadata: Metadata = {
  title: 'About',
  description: 'The story behind RYVOL: coastal luxury apparel, Follow the Current.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
