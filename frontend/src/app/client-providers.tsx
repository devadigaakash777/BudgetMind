'use client';

import React from 'react';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import { UserProvider } from '@/contexts/user-context';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import AppInitLoader from '@/components/dashboard/app-init-loader';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <LocalizationProvider>
        <UserProvider>
          <ThemeProvider>
            <AppInitLoader />
            {children}
          </ThemeProvider>
        </UserProvider>
      </LocalizationProvider>
    </Provider>
  );
}
