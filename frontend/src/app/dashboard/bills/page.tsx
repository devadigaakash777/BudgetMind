import { Metadata } from 'next';
import FixedExpensesContent from './bill-content';
import { config } from '@/config';

export const metadata = { title: `Bills | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <FixedExpensesContent />;
}
