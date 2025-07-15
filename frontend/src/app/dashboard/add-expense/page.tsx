import React from 'react';
import { Metadata } from 'next';
import AddExpenseContent from '@/app/dashboard/add-expense/add-expense-content';
import { config } from '@/config';

export const metadata = { title: `AddExpense | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <AddExpenseContent />;
}