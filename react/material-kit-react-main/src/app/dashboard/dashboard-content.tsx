'use client';

import * as React from 'react';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { filterCurrentMonth } from '@/utils/filter-current-month';
import { DailyExpense } from '@/redux/slices/dailyExpensesSlice';

import { Budget } from '@/components/dashboard/overview/budget';
import { FixedExpense } from '@/components/dashboard/overview/fixed-expense';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { Sales } from '@/components/dashboard/overview/sales';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { Traffic } from '@/components/dashboard/overview/traffic';

export default function DashboardContent(): React.JSX.Element {
  const dispatch = useDispatch();
  const walletState = useSelector((state: RootState) => state.wallet);
  const budgetState = useSelector((state: RootState) => state.budget);
  const previewState = useSelector((state: RootState) => state.preview);
  const wishlist = useSelector((state: RootState) => state.wishlist);
  const dailyExpenseState = useSelector((state: RootState) => state.expense); 

  // Pie chart content
  const pieChartSeries = {
    'Secure Saving': walletState.MainWallet.balance,
    'Spending Wallet': walletState.TemporaryWallet.balance,
    'Monthly Allowance': walletState.SteadyWallet.balance,
    'Budget Leftover': walletState.DailyBuffer.balance,
  };

  //Daily expense Chart
  const filteredDailyExpenseState: DailyExpense[] = filterCurrentMonth(dailyExpenseState.data);
  const barChartSeries = filteredDailyExpenseState.map(item => item.amount);

  //Fixed Cost
  const expenses = budgetState.FixedExpenses.expenses.map((expense, index) => ({
    id: `BILL-${String(expense.id).padStart(3, '0')}`, // e.g., ORD-001
    billName: expense.billName,
    amount: expense.amount,
    status: expense.status as 'pending' | 'paid' | 'expired',
    dueDate: new Date(expense.dueDate), // optional time logic
  }));


  // wishlist items 
   const products = wishlist.items.map((item, index) => ({
    id: `WIS-${item.id}`,
    name: `${item.name}`,
    image: `${item.image}`, // Adjust image path logic as needed
    cost: `${item.cost}`,
  }));

  return (
    <Grid container spacing={3}>
      <Grid
        size={{
          lg: 3,
          sm: 6,
          xs: 12,
        }}
      >
        <Budget diff={12} trend="up" sx={{ height: '100%' }} value={`${previewState?.processedState?.DailyBudget?.amount ?? budgetState.DailyBudget.amount}`} />
      </Grid>
      <Grid
        size={{
          lg: 3,
          sm: 6,
          xs: 12,
        }}
      >
        <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value={`${previewState?.processedState?.TemporaryWallet?.balance ?? walletState.TemporaryWallet.balance}`} />
      </Grid>
      <Grid
        size={{
          lg: 3,
          sm: 6,
          xs: 12,
        }}
      >
        <TasksProgress sx={{ height: '100%' }} value={100} />
      </Grid>
      <Grid
        size={{
          lg: 3,
          sm: 6,
          xs: 12,
        }}
      >
        <TotalProfit sx={{ height: '100%' }} value={`${previewState?.processedState?.MainWallet?.balance ?? walletState.MainWallet.balance}`} />
      </Grid>
      <Grid
        size={{
          lg: 8,
          xs: 12,
        }}
      >
        <Sales
          chartSeries={[
            { name: 'This year', data: barChartSeries },
            // { name: 'Last year', data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13] },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid
        size={{
          lg: 4,
          md: 6,
          xs: 12,
        }}
      >
        <Traffic chartSeries={Object.values(pieChartSeries)} labels={Object.keys(pieChartSeries)} sx={{ height: '100%' }} />
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
  );
}
