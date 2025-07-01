import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { WalletState } from '@/types/wallet';

const initialState: WalletState = {
  MainWallet: { balance: 0 },
  TemporaryWallet: { balance: 0 },
  SteadyWallet: { balance: 0, month: 0, date: 0, monthlyAmount: 0 },
  DailyBuffer: { balance: 0 },
  TotalWealth: { amount: 0 },
  PendingPayments: { amount: 0 },
  threshold: 0
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    updateWalletState(state, action: PayloadAction<Partial<WalletState>>) {
      return { ...state, ...action.payload };
    },
    updateSteadyWallet(
      state,
      action: PayloadAction<Partial<Pick<WalletState['SteadyWallet'], 'month' | 'date' | 'monthlyAmount'>>>
    ) {
      const { month, date, monthlyAmount } = action.payload;

      if (typeof month === 'number') {
        state.SteadyWallet.month = month;
      }

      if (typeof date === 'number') {
        state.SteadyWallet.date = date;
      }

      if (typeof monthlyAmount === 'number') {
        state.SteadyWallet.monthlyAmount = monthlyAmount;
      }
    },
    setThreshold(state, action: PayloadAction<{ threshold: number }>) {
      state.threshold = action.payload.threshold;
    },
    updateMainWallet(state, action: PayloadAction<{ balance: number }>) {
      if (typeof action.payload.balance === 'number') {
        state.MainWallet.balance = action.payload.balance;
      }
    },
    setTotalWealth(state, action: PayloadAction<number>) {
      const balance = action.payload;
      if (typeof balance === 'number') {
        state.TotalWealth.amount = action.payload;
      }
    },
    updateTempWallet(state, action: PayloadAction<number>) {
      if (typeof action.payload === 'number') {
        state.TemporaryWallet.balance += action.payload;
      }
    },
  }
});

export const {
  updateWalletState,
  updateSteadyWallet,
  updateMainWallet,
  setThreshold,
  setTotalWealth,
  updateTempWallet
} = walletSlice.actions;

export default walletSlice.reducer;
