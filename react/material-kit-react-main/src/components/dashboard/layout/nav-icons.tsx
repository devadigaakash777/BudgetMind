import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';
import { HeartIcon, MoneyIcon, ReceiptIcon } from '@phosphor-icons/react/dist/ssr';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': HeartIcon,
  'x-square': XSquare,
  user: UserIcon,
  users: MoneyIcon,
} as Record<string, Icon>;
