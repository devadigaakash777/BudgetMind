'use client';
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';
import { Grid } from '@mui/system';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setPage, setRowsPerPage, addExpense } from '@/redux/slices/dailyExpensesSlice';
import { AddExpenseForm } from '@/components/dashboard/add-expense/expense-modal'

import { DailyExpensesFilters } from '@/components/dashboard/expense/expenses-filters';
import { DailyExpensesTable } from '@/components/dashboard/expense/expenses-table';
import type { DailyExpense } from '@/components/dashboard/expense/expenses-table';
import GaugeSpeedometer from '@/components/dashboard/expense/expense-gauge-chart'
type GaugeLimit = { value: number; label?: string };

export default function AddExpenseContent(): React.JSX.Element {
  const walletState = useSelector((state: RootState) => state.wallet);
  const budgetState = useSelector((state: RootState) => state.budget);
  const wishlistState = useSelector((state: RootState) => state.wishlist);
  const userState = useSelector((state: RootState) => state.user);

  // Pie Chart Details
  const pieChartSeries = {
    'Secure Saving': walletState.MainWallet.balance,
    'Spending Wallet': walletState.TemporaryWallet.balance,
    'Monthly Allowance': walletState.SteadyWallet.balance,
    'Bill Saving': budgetState.FixedExpenses.totalSavedAmount,
    'Wishlist Saving': wishlistState.totalSavedAmount,
    'Daily Saving': walletState.DailyBuffer.balance,
  };

  //Gauge meter value
  const daily = budgetState.DailyBudget.amount;
  const buffer = walletState.DailyBuffer.balance;
  const temp = walletState.TemporaryWallet.balance;
  const main = walletState.MainWallet.balance;
  const fixed = budgetState.FixedExpenses.totalSavedAmount;

  const dailyBudget = daily;
  const dailyBuffer = daily + buffer;
  const tempWallet = dailyBuffer + temp;
  const mainWallet = tempWallet + main;
  const allWallet = mainWallet + fixed;
  const impossible = allWallet + 1;


  const gaugeList={
      'Neutral': { value: 0, label:"Enter Value"},
      'Good': { value: dailyBudget, label:"Great! Your budget is enough to cover this expense"},
      'Slightly over': { value: dailyBuffer, label:"Your expense slightly exceeds your budget, but don't worry — you can manage it using leftover funds or past savings."},
      'Spending Wallet': { value: tempWallet, label:"Your budget isn't enough. This amount will be taken from your Spending Wallet. Please spend wisely."},
      'Savings Access': { value: mainWallet, label:"This expense is high and exceeds your spending limit. It will be deducted from your Main Wallet (savings). Please fill out the form above for tracking."},
      'High Risk': { value: allWallet, label:"Warning: This is a risky expense. It significantly exceeds your usual limits and requires funds from your Main Wallet. Proceed with caution."},
      'Impossible': { value: impossible, label:"This expense is too high. It's not possible to proceed. Please update the available funds above if you still wish to spend."},
    }

  const dispatch = useDispatch();

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Account</Typography>
      </div>
      <Grid container spacing={3}>
        <Grid
          size={{
            lg: 12,
            md: 12,
            xs: 12,
          }}
        >
          <AddExpenseForm 
            userid={userState.userid}
            onAdd={(payload) => dispatch(addExpense(payload))}
            pieChartSeries={pieChartSeries} 
            gaugeList={gaugeList}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}

function applyPagination(rows: DailyExpense[], page: number, rowsPerPage: number): DailyExpense[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}


