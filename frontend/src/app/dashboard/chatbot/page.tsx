import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { Notifications } from '@/components/dashboard/chatbot/notifications';
import ChatbotComponent from '@/components/dashboard/chatbot/chatbot-widget';

export const metadata = { title: `ChatBot | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack>
      <div style={{
        height: "72vh",
        width: "100%",
        overflow: "hidden",
      }}>
        <ChatbotComponent />
      </div>
    </Stack>
  );
}
