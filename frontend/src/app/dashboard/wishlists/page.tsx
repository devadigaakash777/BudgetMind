import React from 'react';
import { Metadata } from 'next';
import WishlistContent from './wishlist-content';
import { config } from '@/config';

export const metadata = { title: `Wishlist | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <WishlistContent />;
}
