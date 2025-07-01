import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { BudgetState, Expense } from '@/types/budget'; // or same file
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
        _id: "unknown",
        billName: "Bill Name",
        status: "pending",
        dueDate: 1,
        isPaid: false,
        amount: 0,
        isPermanent: false,
        isFunded: false,
        durationInMonths: 0,
        amountToFund: 0
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
    updateBudgetState(state, action: PayloadAction<BudgetState>) {
      return { ...state, ...action.payload };
    },
    addFixedExpense(state, action: PayloadAction<Expense>) {
      state.FixedExpenses.expenses.push(action.payload);
    },
    deleteExpense(state, action: PayloadAction<string>) {
      state.FixedExpenses.expenses = state.FixedExpenses.expenses.filter(exp => exp._id !== action.payload);
    },
    payExpense(state, action: PayloadAction<string>) {
      const expense = state.FixedExpenses.expenses.find(exp => exp._id === action.payload);
      if (expense && expense.isFunded && !expense.isPaid) {
        expense.isPaid = true;
        expense.status = "paid";
      }
    },
    increaseDuration(state, action: PayloadAction<string>) {
      const expense = state.FixedExpenses.expenses.find(exp => exp._id === action.payload);
      if (expense) {
        expense.durationInMonths += 1;
      }
    },
    decreaseDuration(state, action: PayloadAction<string>) {
      const expense = state.FixedExpenses.expenses.find(exp => exp._id === action.payload);
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
  updateDailyBudget,
  addFixedExpense
} = budgetSlice.actions;

export default budgetSlice.reducer;
