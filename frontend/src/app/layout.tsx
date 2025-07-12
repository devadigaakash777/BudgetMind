import * as React from 'react';
import type { Viewport } from 'next';

import '@/styles/global.css';
import ClientProviders from './client-providers';
import ChatbotFab from '@/components/common/chatbot-fab';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          {children}
          <ChatbotFab />
        </ClientProviders>
      </body>
    </html>
  );
}
