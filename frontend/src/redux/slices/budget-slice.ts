import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { BudgetState } from '@/types/budget'; // or same file
import { stat } from 'fs';

const initialState: BudgetState = {
  MonthlyBudget: {
    amount: 200,
    amountFunded: 3000
  },
  DailyBudget: {
    amount: 100,
    setAmount: 100,
    min: 10,
    max: 200
  },
  FixedExpenses: {
    expenses: [
      {
        id: "1",
        billName: "Electricity Bill",
        status: "pending",
        dueDate: 28,
        isPaid: false,
        amount: 1500,
        isPermanent: true,
        isFunded: true,
        durationInMonths: 3,
        amountToFund: 1500
      },
      {
        id: "2",
        billName: "Bike EMI",
        status: "paid",
        isPaid: true,
        dueDate: 18,
        amount: 2000,
        isPermanent: false,
        isFunded: true,
        durationInMonths: 1,
        amountToFund: 2000
      },
      {
        id: "3",
        billName: "Rent",
        status: "expired",
        isPaid: false,
        dueDate: 16,
        amount: 8000,
        isPermanent: true,
        isFunded: false,
        durationInMonths: 2,
        amountToFund: 800
      }
    ],
    rowsPerPage: 3,
    totalSavedAmount: 7200,
  }
};


const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    updateDailyBudget(
      state, 
      action: PayloadAction<
        {
          setAmount: number;
          minAmount: number;
          maxAmount: number;
        }
      >) {
      const {setAmount, minAmount, maxAmount} = action.payload;
      state.DailyBudget.setAmount = setAmount;
      state.DailyBudget.min = minAmount;
      state.DailyBudget.max = maxAmount;
    },
    updateBudgetState(state, action: PayloadAction<Partial<BudgetState>>) {
      return { ...state, ...action.payload };
    },
    deleteExpense(state, action: PayloadAction<string>) {
      state.FixedExpenses.expenses = state.FixedExpenses.expenses.filter(exp => exp.id !== action.payload);
    },
    payExpense(state, action: PayloadAction<string>) {
      const expense = state.FixedExpenses.expenses.find(exp => exp.id === action.payload);
      if (expense && expense.isFunded && !expense.isPaid) {
        expense.isPaid = true;
        expense.status = "paid";
      }
    },
    increaseDuration(state, action: PayloadAction<string>) {
      const expense = state.FixedExpenses.expenses.find(exp => exp.id === action.payload);
      if (expense) {
        expense.durationInMonths += 1;
      }
    },
    decreaseDuration(state, action: PayloadAction<string>) {
      const expense = state.FixedExpenses.expenses.find(exp => exp.id === action.payload);
      if (expense && expense.durationInMonths > 1) {
        expense.durationInMonths -= 1;
      }
    }
  }
});

export const {
  updateBudgetState,
  deleteExpense,
  payExpense,
  increaseDuration,
  decreaseDuration,
  updateDailyBudget
} = budgetSlice.actions;

export default budgetSlice.reducer;
