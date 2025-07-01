import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/lib/axiosInstance';
import {
  updateMainWallet,
  updateTempWallet,
  updateSteadyWallet,
  setThreshold,
  setTotalWealth,
  updateWalletState
} from '../slices/wallet-slice';
import { WalletState } from '@/types/wallet';

const BASE_URL = 'http://localhost:5000/api/wallet';

export const fetchWallet = createAsyncThunk(
  'wallet/fetchWallet',
  async (_, { dispatch }) => {
    const res = await axios.get(BASE_URL);
    dispatch(updateWalletState(res.data as Partial<WalletState>));
  }
);

export const thunkUpdateMainWallet = createAsyncThunk(
  'wallet/updateMainWallet',
  async (balance: number, { dispatch }) => {
    await axios.post(`${BASE_URL}/main`, { balance });
    dispatch(updateMainWallet({ balance }));
  }
);

export const thunkUpdateTempWallet = createAsyncThunk(
  'wallet/updateTempWallet',
  async (delta: number, { dispatch }) => {
    await axios.post(`${BASE_URL}/temp`, { delta });
    dispatch(updateTempWallet(delta));
  }
);

export const thunkUpdateSteadyWallet = createAsyncThunk(
  'wallet/updateSteadyWallet',
  async (
    data: { month?: number; date?: number; monthlyAmount?: number },
    { dispatch }
  ) => {
    await axios.post(`${BASE_URL}/steady`, data);
    dispatch(updateSteadyWallet(data));
  }
);

export const thunkUpdateThreshold = createAsyncThunk(
  'wallet/updateThreshold',
  async (threshold: number, { dispatch }) => {
    await axios.post(`${BASE_URL}/threshold`, { threshold });
    dispatch(setThreshold({ threshold }));
  }
);

export const thunkUpdateTotalWealth = createAsyncThunk(
  'wallet/updateTotalWealth',
  async (amount: number, { dispatch }) => {
    await axios.post(`${BASE_URL}/total-wealth`, { amount });
    dispatch(setTotalWealth(amount));
  }
);
