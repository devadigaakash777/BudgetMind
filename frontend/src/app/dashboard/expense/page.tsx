import { Metadata } from 'next';
import ExpenseContent from './expense-content';
import { config } from '@/config';

export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <ExpenseContent />;
}

