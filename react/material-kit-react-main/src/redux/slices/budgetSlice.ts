import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  MonthlyBudget: {
    amount: 0
  },
  DailyBudget: {
    amount: 100,
    min: 0,
    max: 0
  },
  FixedExpenses: {
    expenses: [
      {
        id: 1,
        billName: "Electricity Bill",
        status: "pending",
        dueDate: 28,
        isPaid: false,
        amount: 1500,
        isPermanent: true,
        isFunded: false,
        durationInMonths: 3,
        amountToFund: 1500
      },
      {
        id: 2,
        billName: "Bike EMI",
        status: "paid",
        isPaid: true,
        dueDate: 18,
        amount: 2000,
        isPermanent: false,
        isFunded: false,
        durationInMonths: 1,
        amountToFund: 2000
      },
      {
        id: 3,
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
    totalSavedAmount: 10700,
  }
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    updateBudgetState(state, action) {
      return { ...state, ...action.payload };
    },
    deleteExpense(state, action) {
      const id = action.payload;
      state.FixedExpenses.expenses = state.FixedExpenses.expenses.filter(exp => exp.id !== id);
    },
    payExpense(state, action) {
      const id = action.payload;
      const expense = state.FixedExpenses.expenses.find(exp => exp.id === id);
      if (expense && expense.isFunded && !expense.isPaid) {
        expense.isPaid = true;
        expense.status = "paid";
      }
    },
    increaseDuration(state, action) {
      const id = action.payload;
      const expense = state.FixedExpenses.expenses.find(exp => exp.id === id);
      if (expense) {
        expense.durationInMonths += 1;
      }
    },
    decreaseDuration(state, action) {
      const id = action.payload;
      const expense = state.FixedExpenses.expenses.find(exp => exp.id === id);
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
  decreaseDuration
} = budgetSlice.actions;

export default budgetSlice.reducer;
