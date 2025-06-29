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
import { RootState } from '@/redux/store';
import { updateBasicInfo, setAvatar, updateSalaryInfo } from '@/redux/slices/user-slice';
import { updateSteadyWallet, setThreshold } from '@/redux/slices/wallet-slice';
import { updateDailyBudget } from '@/redux/slices/budget-slice';

export default function AccountContent(): React.JSX.Element {
  const user = useSelector((state: RootState) => state.user);
  const wallet = useSelector((state: RootState) => state.wallet);
  const budgetState = useSelector((state: RootState) => state.budget);
  const dispatch = useDispatch();

  // specify the limit to setting max Budget 
  const monthlyAmount = user.hasSalary
  ? user.Salary.amount
  : wallet.SteadyWallet.monthlyAmount;

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
            firstName={user.data?.firstName ?? ''}
            lastName={user.data?.lastName ?? ''}
            email={user.data?.email ?? ''}
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
            onSave={(updatedData) => dispatch(updateDailyBudget(updatedData))}
            />
        </Grid>
      </Grid>
    </Stack>
  );
}