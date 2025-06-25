import React from 'react';
import { Metadata } from 'next';
import AccountContent from './account-content';
import { config } from '@/config';

export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <AccountContent />;
}
