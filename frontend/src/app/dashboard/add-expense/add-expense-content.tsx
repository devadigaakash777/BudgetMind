'use client';
import * as React from 'react';
import Button from '@mui/material/Button';
import { Box, Avatar, Typography, IconButton} from '@mui/material';
import Stack from '@mui/material/Stack';
import { ArrowCounterClockwiseIcon, WalletIcon, PlusIcon } from '@phosphor-icons/react/dist/ssr';
import { deepOrange } from '@mui/material/colors';
import { Grid, typography } from '@mui/system';
import FullScreenLoader from '@/components/dashboard/loader';
import { useSelector, useDispatch} from 'react-redux';
import { RootState } from '@/redux/store';
import { selectSource, reduceBudget } from '@/redux/slices/daily-expenses-slice';
import { thunkGenerateAndAddExpenses } from '@/redux/thunks/expense-thunks'
import { AddExpenseForm } from '@/components/dashboard/add-expense/expense-modal'
import { useEffect } from 'react';
import { syncPreview, addPreviewExpense, requestMoney } from '@/redux/thunks/preview-thunks'; 
import type { AppDispatch } from '@/redux/store';
import { TempWalletForm } from '@/components/dashboard/account/expense-wallet-form';
import { updateTempWallet } from '@/redux/slices/wallet-slice';
import { FixedExpense } from '@/components/dashboard/overview/fixed-expense';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { simulateMonthlyAllocation, calculateRequiredAmount } from '@/utils/preview-utils';
import { thunkUpdateTempWallet } from '@/redux/thunks/wallet-thunks';
import dayjs from 'dayjs';

export default function AddExpenseContent(): React.JSX.Element {

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(syncPreview());
    setSourceSelections({ main: false, wishlist: false });
  }, [dispatch]);

  const previewState = useSelector((state: RootState) => state.preview);
  const walletState = useSelector((state: RootState) => state.wallet);
  const budgetState = useSelector((state: RootState) => state.budget);
  const wishlistState = useSelector((state: RootState) => state.wishlist);
  const userState = useSelector((state: RootState) => state.user);
  const isAppLoading = useSelector((state: RootState) => state.loader.isAppLoading);
  const expenseState = useSelector((state: RootState) => state.expense);

  // Add amount to TempWallet
  const [walletAmount, addWalletAmount] = React.useState(false);    
  const handleWalletOpen = () => addWalletAmount(true);
  
  // To give the safer value to the user
  const [maximumSafeAmount, setMaximumSafeAmount] = React.useState(0);

  //Fixed Cost
  const expenses = (previewState?.FixedExpenses ?? budgetState.FixedExpenses).expenses.map(
      (
        expense: {
          _id: string;
          billName: string;
          amount: number;
          amountToFund: number;
          status: 'pending' | 'paid' | 'expired';
          dueDate: number;
        },
      ) => ({
        id: expense._id,
        billName: expense.billName,
        amount: expense.amount,
        dueAmount: expense.amountToFund,
        status: expense.status,
        dueDate: expense.dueDate,
      })
    );

  //check whether both selected to fetch money
  const [sourceSelections, setSourceSelections] = React.useState({
    main: false,
    wishlist: false
  });
  
  // wishlist items 
   const products = (previewState?.Wishlist?.items ?? wishlistState.items).map(
    (
      item: {
        _id: number | string;
        name: string;
        image: string;
        cost: number;
        savedAmount: number;
      },
    ) => ({
      id: `WISH-${String(item._id).padStart(3, '0')}`,
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

  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

  const todaysFirstExpense = expenseState.data
    .filter(expense => expense.date === today) // Keep only today's expenses
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]; // Get the earliest one

  const lastExpense = expenseState.data
  .slice()
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const todayJS = dayjs().startOf('day'); // today's date at 00:00
  let daysBetween = null;

  if (lastExpense) {
    const lastDate = dayjs(lastExpense.date, 'YYYY-MM-DD');
    daysBetween = todayJS.diff(lastDate, 'day');
  }


  //Gauge meter value
  const daily = previewState?.DailyBudget?.amount ?? budgetState.DailyBudget.amount;
  const buffer = previewState?.DailyBuffer?.balance ?? walletState.DailyBuffer.balance;
  const temp = previewState?.TemporaryWallet?.balance ?? walletState.TemporaryWallet.balance;
  const main = previewState?.MainWallet?.balance ?? walletState.MainWallet.balance;
  const fixed = previewState?.FixedExpenses?.totalSavedAmount ?? budgetState.FixedExpenses.totalSavedAmount;
  const wishlistSaved = previewState?.Wishlist?.totalSavedAmount ?? wishlistState.totalSavedAmount;

  const dailyBudget = daily;
  const dailyBuffer = buffer;
  const tempWallet = dailyBuffer + temp;
  const mainWallet = tempWallet + main;
  const allWallet = mainWallet + fixed;
  const impossible = allWallet + wishlistSaved + 1;

  const gaugeList={
      'Neutral': { value: 0, label:"Enter Value"},
      'Good': { value: dailyBudget, label:"Great! Your budget is enough to cover this expense"},
      'Slightly over': { value: dailyBuffer, label:"Your expense slightly exceeds your budget, but don't worry — you can manage it using leftover funds or past savings."},
      'Spending Wallet': { value: tempWallet, label:"Your budget isn't enough. This amount will be taken from your Spending Wallet. Please spend wisely."},
      'Savings Access': { value: mainWallet, label:"This expense is high and exceeds your spending limit. It will be deducted from your Main Wallet (savings). Please fill out the form above for tracking."},
      'High Risk': { value: allWallet, label:"Warning: This is a risky expense. It significantly exceeds your usual limits and requires funds from your Main Wallet. Proceed with caution."},
      'Impossible': { value: impossible, label:"This expense is too high. It's not possible to proceed. Please update the available funds above if you still wish to spend."},
    }

    calculateRequiredAmount(previewState);
    const handleReset = () => {
      dispatch(syncPreview());
      const simulated = calculateRequiredAmount(previewState);
      console.log("simulated "+simulated);
      const safe = temp >= simulated ? temp - simulated : 0;
      setMaximumSafeAmount(safe);
      setSourceSelections({ main: false, wishlist: false }); // 🔄 reset
    };

  if (isAppLoading) {
    return (
      <FullScreenLoader />
    );
  }
 
  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        {/* Left: Reset Button */}
        <Button
          color="primary"
          variant="contained"
          startIcon={<ArrowCounterClockwiseIcon size={20} />}
          onClick={handleReset}
        >
          Reset
        </Button>

        {/* Right: Wallet Card */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            borderRadius: 2,
            boxShadow: 1,
            border: '1px solid #e0e0e0',
            backgroundColor: 'background.paper',
            width: '100%',
            maxWidth: 400,
          }}
        >
          <Avatar sx={{ bgcolor: deepOrange[500], width: 56, height: 56 }}>
            <WalletIcon size={28} weight="fill" color="white" />
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Balance
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              ₹ {walletState.TemporaryWallet.balance.toFixed(2)}
            </Typography>
          </Box>

          <IconButton color="primary" onClick={handleWalletOpen}>
            <ArrowCounterClockwiseIcon size={24} weight="bold" />
          </IconButton>
        </Box>
        <TempWalletForm
          open={walletAmount}
          onClose={() => addWalletAmount(false)}
          currentBalance={walletState.TemporaryWallet.balance} 
          onAdd={() => dispatch(syncPreview())}
          onSave={(val) => dispatch(thunkUpdateTempWallet(val))}
        />
      </Box>
      <Grid container spacing={3}>
        <Grid
          size={{
            lg: 12,
            md: 12,
            xs: 12,
          }}
        >
        { userState?.data?._id  && !todaysFirstExpense ?
          <AddExpenseForm 
            userid={userState.data._id}
            maximumSafeAmount={maximumSafeAmount}
            restrictedDuration={daysBetween}
            onAdd={(payload) => dispatch(thunkGenerateAndAddExpenses(payload))}
            onAddPreview={(value) => dispatch(addPreviewExpense(value))}
            pieChartSeries={pieChartSeries} 
            gaugeList={gaugeList}
            onSelectSource={(v) => dispatch(selectSource(v))}
            onChangeCanBudget={(v) => dispatch(reduceBudget(v))}
            onRequest={(amount, source, canReduce) =>
              dispatch(requestMoney(amount, source, canReduce))
            }
            sourceSelections={sourceSelections}
            setSourceSelections={setSourceSelections}
          />
          :
          <FullScreenLoader text='Expense added Successfully' />
        }
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



