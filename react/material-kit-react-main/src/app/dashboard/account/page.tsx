import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form';
import { ConnectedAccountInfo } from '@/components/dashboard/account/connected-account-info';

export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Account</Typography>
      </div>
      <Grid container spacing={3}>
        <Grid
          size={{
            lg: 4,
            md: 6,
            xs: 12,
          }}
        >
          <ConnectedAccountInfo />
        </Grid>
        <Grid
          size={{
            lg: 8,
            md: 6,
            xs: 12,
          }}
        >
          <AccountDetailsForm />
        </Grid>
      </Grid>
    </Stack>
  );
}
