import { Metadata } from 'next';
import DashboardContent from './dashboard-content';
import { config } from '@/config';

export const metadata: Metadata = {
  title: `Overview | Dashboard | ${config.site.name}`,
};

export default function Page(): React.JSX.Element {
  return <DashboardContent />;
}
