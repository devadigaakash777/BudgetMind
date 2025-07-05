// src/redux/thunks/dailyExpenseThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/lib/axiosInstance'; // your custom axios instance
import { setDailyExpense } from '../slices/daily-expenses-slice';
import type { DailyExpense } from '@/types/daily-expense';

const BASE_URL = 'http://localhost:5000/api';

// Fetch all daily expenses of the logged-in user
export const thunkFetchDailyExpenses = createAsyncThunk(
  'dailyExpense/fetch',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get<DailyExpense[]>(`${BASE_URL}/expense`);
      dispatch(setDailyExpense(response.data));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Unauthorized or failed to fetch expenses');
    }
  }
);

interface GenerateExpensePayload {
  totalAmount: number;
  numberOfDays: number;
  details: string;
  source: 'wishlist' | 'main';
  canReduceBudget: boolean;
  usedBoth: boolean;
}

// Generate and add expenses to DB
export const thunkGenerateAndAddExpenses = createAsyncThunk(
  'dailyExpense/generateAdd',
  async (payload: GenerateExpensePayload, { dispatch, rejectWithValue }) => {
    try {
      await axios.post(`${BASE_URL}/expense/generate-add`, payload);
      await dispatch(thunkFetchDailyExpenses());
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to generate/add expenses');
    }
  }
);
