'use client';

import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { filterCurrentMonth } from '@/utils/filter-current-month';
import { DailyExpense } from '@/types/daily-expense';

import { Budget } from '@/components/dashboard/overview/budget';
import { FixedExpense } from '@/components/dashboard/overview/fixed-expense';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { DailyExpenseChart } from '@/components/dashboard/overview/daily-expense-chart';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { SpendingWallet } from '@/components/dashboard/overview/spending-wallet';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { WalletChart } from '@/components/dashboard/overview/wallet-chart';
import { TempWalletForm } from '@/components/dashboard/account/expense-wallet-form';
import { updateSteadyWallet, setThreshold, setTotalWealth, updateTempWallet } from '@/redux/slices/wallet-slice';
import { updateDailyBudget } from '@/redux/slices/budget-slice';
import { updateSalaryInfo, handleModel } from '@/redux/slices/user-slice';
import { BudgetSetupDialog } from '@/components/dashboard/account/budget-setup-dialog';

export default function DashboardContent(): React.JSX.Element {
  const walletState = useSelector((state: RootState) => state.wallet);
  const budgetState = useSelector((state: RootState) => state.budget);
  const wishlist = useSelector((state: RootState) => state.wishlist);
  const dailyExpenseState = useSelector((state: RootState) => state.expense); 
  const userState = useSelector((state: RootState) => state.user);

  //Budget setup for first time
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
    
  const handleOpen = () => setOpen(true);


  //Add amount to TempWallet
  const [walletAmount, addWalletAmount] = React.useState(false);
    
  const handleWalletOpen = () => addWalletAmount(true);

  // Pie chart content
  const pieChartSeries = {
    'Secure Saving': walletState.MainWallet.balance,
    'Spending Wallet': walletState.TemporaryWallet.balance,
    'Monthly Allowance': walletState.SteadyWallet.balance,
    'Budget Leftover': walletState.DailyBuffer.balance,
  };

  // Ensure `handleOpen()` is called only once when isProfileComplete === false
  React.useEffect(() => {
    if (userState.isProfileComplete === false) {
      handleOpen();
    }
  }, [userState.isProfileComplete]);

  const monthlyAmount = userState.hasSalary
  ? userState.Salary.amount
  : walletState.SteadyWallet.monthlyAmount;

  //Daily expense Chart
  const filteredDailyExpenseState: DailyExpense[] = filterCurrentMonth(dailyExpenseState.data);
  const barChartSeries = filteredDailyExpenseState.map(item => item.amount);

  //Fixed Cost
  const expenses = budgetState.FixedExpenses.expenses.map((expense) => ({
    id: `BILL-${String(expense.id).padStart(3, '0')}`, // e.g., ORD-001
    billName: expense.billName,
    amount: expense.amount,
    dueAmount: expense.amountToFund,
    status: expense.status as 'pending' | 'paid' | 'expired',
    dueDate: expense.dueDate, 
  }));

  // wishlist items 
   const products = wishlist.items
   .slice(-3)
   .map((item) => ({
    id: `${item.id}`,
    name: `${item.name}`,
    image: `${item.image}`, // Adjust image path logic as needed
    cost: item.cost,
    savedAmount: item.savedAmount
  }));

  const remainPercentage = Number(
    (((budgetState.MonthlyBudget.amountFunded - budgetState.MonthlyBudget.amount)
       / budgetState.MonthlyBudget.amountFunded) * 100).toFixed(2)
  );



  return (
    <Grid container spacing={3}>
      <Grid
        size={{
          lg: 3,
          sm: 6,
          xs: 12,
        }}
      >
        <Budget sx={{ height: '100%' }} value={`${budgetState.DailyBudget.amount}`} />
      </Grid>
      <Grid
        size={{
          lg: 3,
          sm: 6,
          xs: 12,
        }}
      >
        <SpendingWallet onOpen={handleWalletOpen} sx={{ height: '100%' }} value={`${walletState.TemporaryWallet.balance}`} />
      </Grid>
      <Grid
        size={{
          lg: 3,
          sm: 6,
          xs: 12,
        }}
      >
        <TasksProgress sx={{ height: '100%' }} value={remainPercentage} />
      </Grid>
      <Grid
        size={{
          lg: 3,
          sm: 6,
          xs: 12,
        }}
      >
        <TotalProfit sx={{ height: '100%' }} value={`${walletState.MainWallet.balance}`} />
      </Grid>
      <Grid
        size={{
          lg: 8,
          xs: 12,
        }}
      >
        <TempWalletForm
          open={walletAmount}
          onClose={() => addWalletAmount(false)}
          currentBalance={walletState.TemporaryWallet.balance} 
          onSave={(val) => dispatch(updateTempWallet(val))}
        />
        <BudgetSetupDialog
              open={open}
              onClose={() => setOpen(false)}
              onComplete={(val) => dispatch(handleModel(val))}
              salary={monthlyAmount}
              onTotalWealthSave={(val) => dispatch(setTotalWealth(val))}
              onSalarySave={(data) => dispatch(updateSalaryInfo(data))}
              onSteadySave={(data) => dispatch(updateSteadyWallet(data))}
              onThresholdSave={(data) => dispatch(setThreshold(data))}
              onDailyBudgetSave={(val) => dispatch(updateDailyBudget(val))}
          />
        <DailyExpenseChart
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
        <WalletChart chartSeries={Object.values(pieChartSeries)} labels={Object.keys(pieChartSeries)} sx={{ height: '100%' }} />
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
