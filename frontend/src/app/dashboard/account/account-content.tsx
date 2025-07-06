'use client';
import * as React from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form';
import { AccountInfo } from '@/components/dashboard/account/account-info';
import { AccountSalaryForm } from '@/components/dashboard/account/account-salary-form';
import { DailyBudgetForm } from '@/components/dashboard/account/set-budget-details'

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { updateUserBasicInfo, updateUserAvatar, updateUserSalaryInfo } from '@/redux/thunks/profile-thunks';
import { thunkUpdateSteadyWallet, thunkUpdateThreshold } from '@/redux/thunks/wallet-thunks';
import { thunkUpdateDailyBudget } from '@/redux/thunks/budget-thunks';
import FullScreenLoader from '@/components/dashboard/loader';

export default function AccountContent(): React.JSX.Element {
  const user = useSelector((state: RootState) => state.user);
  const wallet = useSelector((state: RootState) => state.wallet);
  const budgetState = useSelector((state: RootState) => state.budget);
  const isAppLoading = useSelector((state: RootState) => state.loader.isAppLoading);
  
  const dispatch = useDispatch<AppDispatch>();

  // specify the limit to setting max Budget 
  const monthlyAmount = user.hasSalary
  ? user.salary.amount
  : wallet.SteadyWallet.monthlyAmount;

  if (isAppLoading) {
    return (
      <FullScreenLoader />
    );
  }
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
            name={user.data?.firstName ?? ''}
            avatar={user.data?.avatar ?? ''}
            jobTitle={user.jobTitle}
            city={user.address?.[0]?.city ?? ''}
            country={user.address?.[0]?.country ?? ''}
            timezone={user.address?.[0]?.timezone ?? ''}
            onAdd={(imageURL) => dispatch(updateUserAvatar(imageURL))}
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
            firstName={user.data?.firstName ?? ''}
            lastName={user.data?.lastName ?? ''}
            email={user.data?.email ?? ''}
            phone={user.phone}
            state={user.address[0]?.state}
            city={user.address[0]?.city}
            onSave={(updatedData) => dispatch(updateUserBasicInfo(updatedData))}
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
            salaryAmount={user.salary.amount}
            salaryDate={user.salary.date}
            jobTitle={user.jobTitle}
            steadyDate={wallet.SteadyWallet.date}
            steadyMonth={wallet.SteadyWallet.month}
            steadyMonthlyAmount={wallet.SteadyWallet.monthlyAmount}
            threshold={wallet.threshold}
            onSave={(updatedData) => dispatch(updateUserSalaryInfo(updatedData))}
            onSteadySave={(updatedSteadyData) => dispatch(thunkUpdateSteadyWallet(updatedSteadyData))}
            onThresholdSave={(updatedThreshold) => dispatch(thunkUpdateThreshold(updatedThreshold.threshold))}
          />
        </Grid>
        <Grid
          size={{
            lg: 12,
            md: 12,
            xs: 12,
          }}
        >
          <DailyBudgetForm
            salary = {monthlyAmount}
            currentAmount = {budgetState.DailyBudget.amount}
            setAmount = {budgetState.DailyBudget.setAmount}
            minAmount = {budgetState.DailyBudget.min}
            maxAmount = {budgetState.DailyBudget.max}
            onSave={(updatedData) => dispatch(thunkUpdateDailyBudget(updatedData))}
            />
        </Grid>
      </Grid>
    </Stack>
  );
}