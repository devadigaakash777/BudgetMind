import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'expenses', title: 'Expenses', href: paths.dashboard.expenses, icon: 'expense' },
  { key: 'wishlists', title: 'Wishlists', href: paths.dashboard.wishlists, icon: 'heartIcon' },
  { key: 'bill', title: 'Bills', href: paths.dashboard.bills, icon: 'receipt' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
