import { getSiteURL } from '@/lib/get-site-url';
import { LogLevel } from '@/lib/logger';

export interface Config {
  site: {
    name: string;
    description: string;
    themeColor: string;
    url: string;
  };
  apiBaseUrl: string;
  logLevel: keyof typeof LogLevel;
}

export const config: Config = {
  site: {
    name: 'Budget Mind',
    description: '',
    themeColor: '#090a0b',
    url: getSiteURL(),
  },
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://budgetmind-backend.onrender.com/api',
  logLevel: (process.env.NEXT_PUBLIC_LOG_LEVEL as keyof typeof LogLevel) ?? LogLevel.ALL,
};
