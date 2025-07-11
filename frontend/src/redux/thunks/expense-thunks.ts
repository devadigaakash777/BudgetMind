// src/redux/thunks/dailyExpenseThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/lib/axiosInstance'; // your custom axios instance
import { setDailyExpense } from '../slices/daily-expenses-slice';
import type { DailyExpense } from '@/types/daily-expense';
import { refetchAllUserData } from '@/redux/thunks/global-refresh';
import type { AppDispatch } from '@/redux/store';

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
      await refetchAllUserData(dispatch as AppDispatch);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to generate/add expenses');
    }
  }
);

interface DownloadExcelPayload {
  fromDate: string;
  toDate: string;
}

export const thunkDownloadExpensesExcel = createAsyncThunk<
  void, // no return type
  DownloadExcelPayload, 
  { rejectValue: string }
>(
  'dailyExpense/downloadExcel',
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/expense/download`, {
        params: { from: fromDate, to: toDate },
        responseType: 'blob', // Ensures backend returns a Blob
      });

      const blob = response.data as Blob; // 👈 Fix the TS error
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `expenses_${fromDate}_to_${toDate}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to download Excel'
      );
    }
  }
);

