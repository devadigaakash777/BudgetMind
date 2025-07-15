'use client';

import * as React from 'react';
import { Fab, Box, Fade, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { paths } from '@/paths';

export default function ChatbotFab() {
  const [showWelcome, setShowWelcome] = React.useState(true);
  const pathname = usePathname();

  // ✅ Always call hooks before conditional return
  React.useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ This condition now comes AFTER all hooks
  const hiddenPaths = [
    '/auth/sign-in',
    '/auth/sign-up',
    '/auth/reset-password',
    '/auth/forgot-password',
    '/auth/verify-email',
  ];
  if (hiddenPaths.some((path) => pathname.startsWith(path))) return null;

  return (
    <>
      {/* Welcome Message Bubble */}
      <Fade in={showWelcome}>
        <Box
          sx={{
            position: 'fixed',
            bottom: 90,
            right: 24,
            bgcolor: '#635bff',
            color: 'white',
            px: 2,
            py: 1,
            borderRadius: 2,
            boxShadow: 3,
            fontSize: 14,
            zIndex: 1500,
            maxWidth: 240,
          }}
        >
          <Typography variant="body2">👋 Hey! Need any help?</Typography>
        </Box>
      </Fade>

      {/* Floating Chat Button */}
      <Fab
        component={Link}
        href={paths.dashboard.chatbot}
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1500,
          width: 56,
          height: 56,
          boxShadow: 4,
        }}
      >
        <Box
          component="img"
          src="/assets/smart-pig.avif"
          alt="Chatbot"
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
          }}
        />
      </Fab>
    </>
  );
}
