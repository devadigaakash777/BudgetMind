import React from 'react';
import { Metadata } from 'next';
import ExpenseContent from './expense-content';
import { config } from '@/config';

export const metadata = { title: `Expenses | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <ExpenseContent />;
}

