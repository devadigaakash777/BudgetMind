import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/lib/axios-instance'; // your custom axios instance
import { setDailyExpense } from '../slices/daily-expenses-slice';
import type { DailyExpense } from '@/types/daily-expense';
import { refetchAllUserData } from '@/redux/thunks/global-refresh';
import type { AppDispatch } from '@/redux/store';
import { config } from '@/config';

const BASE_URL = config.apiBaseUrl;

// Fetch all daily expenses of the logged-in user
export const thunkFetchDailyExpenses = createAsyncThunk(
  'dailyExpense/fetch',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get<DailyExpense[]>(`${BASE_URL}/expense`);
      dispatch(setDailyExpense(response.data));
      return response.data;
    } catch {
      return rejectWithValue('failed to fetch expenses');
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
    } catch {
      return rejectWithValue('Failed to generate/add expenses');
    }
  }
);

interface DownloadExcelPayload {
  fromDate: string;
  toDate: string;
}

export const thunkDownloadExpensesExcel = createAsyncThunk<
  void, 
  DownloadExcelPayload, 
  { rejectValue: string }
>(
  'dailyExpense/downloadExcel',
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/expense/download`, {
        params: { from: fromDate, to: toDate },
        responseType: 'blob', 
      });

      const blob = response.data as Blob; 
      const url = globalThis.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `expenses_${fromDate}_to_${toDate}.xlsx`;
      a.click();
      globalThis.URL.revokeObjectURL(url);
    } catch {
      return rejectWithValue(
        'Failed to download Excel'
      );
    }
  }
);

