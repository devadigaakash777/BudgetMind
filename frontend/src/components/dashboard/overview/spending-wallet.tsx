import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { WalletIcon } from '@phosphor-icons/react/dist/ssr';
import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react';

export interface SpendingWalletProps {
  onOpen: () => void;
  sx?: SxProps;
  value: string;
}

export function SpendingWallet({ onOpen, sx, value }: SpendingWalletProps): React.JSX.Element {

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Spending Wallet
              </Typography>
              <Typography variant="h4">₹{value}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-primary-main)', height: '56px', width: '56px' }}>
              <WalletIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
          <Button onClick={onOpen} variant='contained' color="primary" startIcon={<ArrowCounterClockwiseIcon fontSize="var(--icon-fontSize-md)" />} size="small">
            Update Wallet
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
