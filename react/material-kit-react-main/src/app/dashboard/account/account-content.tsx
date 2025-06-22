'use client';
import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form';
import { AccountInfo } from '@/components/dashboard/account/account-info';
import { AccountSalaryForm } from '@/components/dashboard/account/account-salary-form';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { updateBasicInfo, setAvatar, updateSalaryInfo } from '@/redux/slices/userSlice';
import { updateSteadyWallet, setThreshold } from '@/redux/slices/walletSlice';

export default function AccountContent(): React.JSX.Element {
  const user = useSelector((state: RootState) => state.user);
  const wallet = useSelector((state: RootState) => state.wallet);
  const dispatch = useDispatch();
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
          <AccountInfo
            name={user.firstName}
            avatar={user.avatar}
            jobTitle={user.jobTitle}
            city={user.address[0].city}
            country={user.address[0].country}
            timezone={user.address[0].timezone}
            onAdd={(imageURL) => dispatch(setAvatar(imageURL))}
            />
        </Grid>
        <Grid
          size={{
            lg: 8,
            md: 6,
            xs: 12,
          }}
        >
          <AccountDetailsForm
            firstName={user.firstName}
            lastName={user.lastName}
            email={user.email}
            phone={user.phone}
            state={user.address[0]?.state}
            city={user.address[0]?.city}
            onSave={(updatedData) => dispatch(updateBasicInfo(updatedData))}
            />
        </Grid>
        <Grid
          size={{
            lg: 12,
            md: 12,
            xs: 12,
          }}
        >
          <AccountSalaryForm
            hasSalary={user.hasSalary}
            salaryAmount={user.Salary.amount}
            salaryDate={user.Salary.date}
            jobTitle={user.jobTitle}
            steadyDate={wallet.SteadyWallet.date}
            steadyMonth={wallet.SteadyWallet.month}
            steadyMonthlyAmount={wallet.SteadyWallet.monthlyAmount}
            threshold={wallet.threshold}
            onSave={(updatedData) => dispatch(updateSalaryInfo(updatedData))}
            onSteadySave={(updatedSteadyData) => dispatch(updateSteadyWallet(updatedSteadyData))}
            onThresholdSave={(updatedThreshold) => dispatch(setThreshold(updatedThreshold))}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}