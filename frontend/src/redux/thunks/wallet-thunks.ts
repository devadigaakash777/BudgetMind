import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/lib/axios-instance';
import {
  updateMainWallet,
  updateTempWallet,
  updateSteadyWallet,
  setTotalWealth,
  updateWalletState
} from '../slices/wallet-slice';
import { WalletState } from '@/types/wallet';
import { config } from '@/config';
import { refetchAllUserData } from './global-refresh';
import { AppDispatch } from '../store';

const BASE_URL = `${config.apiBaseUrl}/wallet`;

export const fetchWallet = createAsyncThunk(
  'wallet/fetchWallet',
  async (_, { dispatch }) => {
    const res = await axios.get(BASE_URL);
    console.debug("fetchWallet "+res.status);
    dispatch(updateWalletState(res.data as Partial<WalletState>));
  }
);

export const thunkUpdateMainWallet = createAsyncThunk(
  'wallet/updateMainWallet',
  async (balance: number, { dispatch }) => {
    const res = await axios.post(`${BASE_URL}/main`, { balance });
    console.debug("updateMainWallet "+res.status);
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
    const res = await axios.post(`${BASE_URL}/steady`, data);
    console.debug("updateSteadyWallet "+res.status);
    dispatch(updateSteadyWallet(data));
  }
);

export const thunkUpdateThreshold = createAsyncThunk(
  'wallet/updateThreshold',
  async (threshold: number, { dispatch }) => {
    const res = await axios.post(`${BASE_URL}/threshold`, { threshold });
    console.debug("updateThreshold "+res.status);
    await refetchAllUserData(dispatch as AppDispatch);
  }
);

export const thunkUpdateTotalWealth = createAsyncThunk(
  'wallet/updateTotalWealth',
  async (amount: number, { dispatch }) => {
    const res = await axios.post(`${BASE_URL}/total-wealth`, { amount });
    console.debug("updateTotalWealth "+res.status);
    dispatch(setTotalWealth(amount));
  }
);
