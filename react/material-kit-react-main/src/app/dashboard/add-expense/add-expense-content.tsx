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

import { useSelector, useDispatch} from 'react-redux';
import { RootState } from '@/redux/store';
import { addExpense, selectSource, reduceBudget } from '@/redux/slices/dailyExpensesSlice';
import { setPreview } from '@/redux/slices/previewSlice';
import { AddExpenseForm } from '@/components/dashboard/add-expense/expense-modal'

import type { DailyExpense } from '@/components/dashboard/expense/expenses-table';

import { useEffect } from 'react';
import { syncPreview, addPreviewExpense, requestMoney } from '@/redux/thunks/previewThunks'; 
import type { AppDispatch } from '@/redux/store';

import { FixedExpense } from '@/components/dashboard/overview/fixed-expense';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';




export default function AddExpenseContent(): React.JSX.Element {

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(syncPreview());
  }, [dispatch]);

  const previewState = useSelector((state: RootState) => state.preview);
  const walletState = useSelector((state: RootState) => state.wallet);
  const budgetState = useSelector((state: RootState) => state.budget);
  const wishlistState = useSelector((state: RootState) => state.wishlist);
  const userState = useSelector((state: RootState) => state.user);

  

  //Fixed Cost
  const expenses = (previewState?.FixedExpenses ?? budgetState.FixedExpenses).expenses.map(
      (
        expense: {
          id: number;
          billName: string;
          amount: number;
          status: 'pending' | 'paid' | 'expired';
          dueDate: string;
        },
      ) => ({
        id: `BILL-${String(expense.id).padStart(3, '0')}`,
        billName: expense.billName,
        amount: expense.amount,
        status: expense.status,
        dueDate: expense.dueDate,
      })
    );


  // wishlist items 
   const products = (previewState?.Wishlist?.items ?? wishlistState.items).map(
    (
      item: {
        id: number | string;
        name: string;
        image: string;
        cost: number;
        savedAmount: number;
      },
    ) => ({
      id: `WISH-${String(item.id).padStart(3, '0')}`,
      name: item.name,
      image: item.image,
      cost: item.cost,
      savedAmount: item.savedAmount,
    })
  );


  
  // Pie Chart Details
  const pieChartSeries = {
    'Secure Saving': previewState?.MainWallet?.balance ?? walletState.MainWallet.balance,
    'Spending Wallet': previewState?.TemporaryWallet?.balance ?? walletState.TemporaryWallet.balance,
    'Monthly Allowance': previewState?.SteadyWallet?.balance ?? walletState.SteadyWallet.balance,
    'Bill Saving': previewState?.FixedExpenses?.totalSavedAmount ?? budgetState.FixedExpenses.totalSavedAmount,
    'Wishlist Saving': previewState?.Wishlist?.totalSavedAmount ?? wishlistState.totalSavedAmount,
    'Daily Saving': previewState?.DailyBuffer?.balance ?? walletState.DailyBuffer.balance,

  };

  //Gauge meter value
  const daily = previewState?.DailyBudget?.amount ?? budgetState.DailyBudget.amount;
  const buffer = previewState?.DailyBuffer?.balance ?? walletState.DailyBuffer.balance;
  const temp = previewState?.TemporaryWallet?.balance ?? walletState.TemporaryWallet.balance;
  const main = previewState?.MainWallet?.balance ?? walletState.MainWallet.balance;
  const fixed = previewState?.FixedExpenses?.totalSavedAmount ?? budgetState.FixedExpenses.totalSavedAmount;


  const dailyBudget = daily;
  const dailyBuffer = buffer;
  const tempWallet = dailyBuffer + temp;
  const mainWallet = tempWallet + main;
  const allWallet = mainWallet + fixed;
  const impossible = allWallet + 1;

  const overage = 0;


  const gaugeList={
      'Neutral': { value: 0, label:"Enter Value"},
      'Good': { value: dailyBudget, label:"Great! Your budget is enough to cover this expense"},
      'Slightly over': { value: dailyBuffer, label:"Your expense slightly exceeds your budget, but don't worry — you can manage it using leftover funds or past savings."},
      'Spending Wallet': { value: tempWallet, label:"Your budget isn't enough. This amount will be taken from your Spending Wallet. Please spend wisely."},
      'Savings Access': { value: mainWallet, label:"This expense is high and exceeds your spending limit. It will be deducted from your Main Wallet (savings). Please fill out the form above for tracking."},
      'High Risk': { value: allWallet, label:"Warning: This is a risky expense. It significantly exceeds your usual limits and requires funds from your Main Wallet. Proceed with caution."},
      'Impossible': { value: impossible, label:"This expense is too high. It's not possible to proceed. Please update the available funds above if you still wish to spend."},
    }

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Account</Typography>
        <Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />} onClick={() => dispatch(syncPreview())}>
              Undo
            </Button>
          </Stack>
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
            maximumSafeAmount={tempWallet}
            onAdd={(payload) => dispatch(addExpense(payload))}
            onAddPreview={(value) => dispatch(addPreviewExpense(value))}
            pieChartSeries={pieChartSeries} 
            gaugeList={gaugeList}
            onSelectSource={(v) => dispatch(selectSource(v))}
            onChangeCanBudget={(v) => dispatch(reduceBudget(v))}
            onRequest={(amount, source, canReduce) =>
              dispatch(requestMoney(amount, source, canReduce))
            }
          />
        </Grid>
        <Grid
          size={{
            lg: 4,
            md: 6,
            xs: 12,
          }}
        >
          <LatestProducts products={products} sx={{ height: '100%' }} />
        </Grid>
        <Grid
          size={{
            lg: 8,
            md: 12,
            xs: 12,
          }}
        >
          <FixedExpense expenses={expenses} sx={{ height: '100%' }} />
        </Grid>
      </Grid>
    </Stack>
  );
}

function applyPagination(rows: DailyExpense[], page: number, rowsPerPage: number): DailyExpense[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}


