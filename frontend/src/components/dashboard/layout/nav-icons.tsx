import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { HeartIcon, MoneyIcon, ReceiptIcon } from '@phosphor-icons/react/dist/ssr';
import { PlusCircleIcon } from '@phosphor-icons/react';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'heartIcon': HeartIcon,
  'receipt': ReceiptIcon,
  'addExpense': PlusCircleIcon,
  user: UserIcon,
  expense: MoneyIcon,
} as Record<string, Icon>;
