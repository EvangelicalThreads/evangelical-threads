import type { Metadata } from 'next';

// Same reason as about/layout.tsx — page.tsx here is a client component,
// so metadata has to attach via this sibling server-component layout.
export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Shipping, sizing, returns, and everything else you might want to know before ordering from RYVOL.',
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
