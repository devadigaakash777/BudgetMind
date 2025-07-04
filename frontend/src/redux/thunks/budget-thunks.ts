import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/lib/axiosInstance';
import {
  setWishlistItems,
  setWishlistSummary
} from '../slices/wishlist-slice';
import {
  addFixedExpense,
  deleteExpense,
  payExpense,
  increaseDuration,
  decreaseDuration,
  updateBudgetState,
  updateDailyBudget
} from '../slices/budget-slice';
import type { Expense, ExpenseBase, BudgetState } from '@/types/budget';

interface BudgetSummaryResponse {
  summary: BudgetState;
  totalCount: number;
}

const BASE_URL = 'http://localhost:5000/api';

// Fetch budget summary (including fixed expenses)
export const fetchBudgetSummary = createAsyncThunk(
  'budget/fetchBudgetSummary',
  async (_, { dispatch }) => {
    const res = await axios.get<BudgetSummaryResponse>(`${BASE_URL}/budget/summary`);
    const { summary } = res.data;
    console.debug("fetchBudgetSummary "+res.status);
    dispatch(updateBudgetState({
      MonthlyBudget: summary.MonthlyBudget,
      DailyBudget: summary.DailyBudget,
      FixedExpenses: summary.FixedExpenses
    }));
  }
);

// Add fixed expense
export const thunkAddFixedExpense = createAsyncThunk(
  'budget/addFixedExpense',
  async (expense: ExpenseBase, { dispatch }) => {
    const res = await axios.post<Expense>(`${BASE_URL}/budget/expenses`, expense);
    console.debug("addFixedExpense "+res.status);
    dispatch(addFixedExpense(res.data));
  }
);

// Delete fixed expense
export const thunkDeleteFixedExpense = createAsyncThunk(
  'budget/deleteFixedExpense',
  async (id: string, { dispatch }) => {
    await axios.delete(`${BASE_URL}/budget/expenses/${id}`);
    dispatch(deleteExpense(id));
  }
);

// Pay fixed expense
export const thunkPayFixedExpense = createAsyncThunk(
  'budget/payFixedExpense',
  async (id: string, { dispatch }) => {
    const res = await axios.patch(`${BASE_URL}/budget/expenses/${id}/pay`);
    console.debug("payFixedExpense "+res.status);
    dispatch(payExpense(id));
  }
);

// Increase duration
export const thunkIncreaseDuration = createAsyncThunk(
  'budget/increaseDuration',
  async (id: string, { dispatch }) => {
    const res = await axios.patch(`${BASE_URL}/budget/expenses/${id}/duration`, { type: 'increase' });
    console.debug("increaseDuration "+res.status);
    dispatch(increaseDuration(id));
  }
);

// Decrease duration
export const thunkDecreaseDuration = createAsyncThunk(
  'budget/decreaseDuration',
  async (id: string, { dispatch }) => {
    const res = await axios.patch(`${BASE_URL}/budget/expenses/${id}/duration`, { type: 'decrease' });
    console.debug("decreaseDuration "+res.status);
    dispatch(decreaseDuration(id));
  }
);

export const thunkUpdateDailyBudget = createAsyncThunk(
  'budget/updateDailyBudget',
  async (
    data: { setAmount: number; minAmount: number; maxAmount: number },
    { dispatch }
  ) => {
    const res = await axios.patch(`${BASE_URL}/budget/daily-budget`, data);
    console.debug("updateDailyBudget "+res.status);
    // dispatch local Redux update only after success
    dispatch(updateDailyBudget(data));
  }
);