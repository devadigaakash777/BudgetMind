import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import RouterLink from 'next/link';
import { paths } from '@/paths';
import { CurrencyInrIcon, PlusIcon } from '@phosphor-icons/react/dist/ssr';

export interface BudgetProps {
  sx?: SxProps;
  value: string;
}

export function Budget({ sx, value }: BudgetProps): React.JSX.Element {

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Budget
              </Typography>
              <Typography variant="h4">₹{value}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-primary-main)', height: '56px', width: '56px' }}>
              <CurrencyInrIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
          <Button variant='contained' component={RouterLink} href={paths.dashboard.addExpense} color="primary" startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} size="small">
            Add Expense
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
