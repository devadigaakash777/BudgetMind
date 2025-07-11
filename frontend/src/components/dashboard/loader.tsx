'use client';

import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography, Paper, Box } from '@mui/material';
import { PiggyBankIcon } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { typography } from '@mui/system';

const messages = [
  '"Spending Wallet" is where you can spend freely—no worries about wishlist or bills.',
  '"Secure Savings" is your emergency and long-term savings vault. Protect it!',
  'Use "Preview" in Add Expenses to simulate spending. But note: money edits are real!'
];

type FullScreenLoaderProps = {
  text?: string; // optional single message
};

const FullScreenLoader = ({ text }: FullScreenLoaderProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        height: '70vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f4f8',
        flexDirection: 'column',
        gap: 4,
        textAlign: 'center',
        p: 3
      }}
    >
    { !text ?
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', my: 2 }}>
        <CircularProgress
          size={100}
          thickness={4}
          sx={{ position: 'absolute', color: '#4a90e2' }}
        />
        <PiggyBankIcon size={48} weight="duotone" color="#4a90e2" />
      </Box> 
      :
      <Typography variant="h5" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
          {text}
      </Typography>
    }
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              maxWidth: 500,
              px: 4,
              py: 3,
              borderRadius: 3,
              backgroundColor: '#ffffffdd'
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontStyle: 'italic', color: 'black' }}
            >
              {messages[index]}
            </Typography>
          </Paper>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default FullScreenLoader;
