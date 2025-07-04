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
    await axios.patch(`${BASE_URL}/budget/expenses/${id}/pay`);
    dispatch(payExpense(id));
  }
);

// Increase duration
export const thunkIncreaseDuration = createAsyncThunk(
  'budget/increaseDuration',
  async (id: string, { dispatch }) => {
    await axios.patch(`${BASE_URL}/budget/expenses/${id}/duration`, { type: 'increase' });
    dispatch(increaseDuration(id));
  }
);

// Decrease duration
export const thunkDecreaseDuration = createAsyncThunk(
  'budget/decreaseDuration',
  async (id: string, { dispatch }) => {
    await axios.patch(`${BASE_URL}/budget/expenses/${id}/duration`, { type: 'decrease' });
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
    // dispatch local Redux update only after success
    dispatch(updateDailyBudget(data));
  }
);