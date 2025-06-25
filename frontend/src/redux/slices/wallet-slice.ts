import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { WalletState } from '@/types/wallet';

const initialState: WalletState = {
  MainWallet: { balance: 7000 },
  TemporaryWallet: { balance: 1000 },
  SteadyWallet: { balance: 5000, month: 4, date: 1, monthlyAmount: 5000 },
  DailyBuffer: { balance: 100 },
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
    }
  }
});

export const {
  updateWalletState,
  updateSteadyWallet,
  updateMainWallet,
  setThreshold
} = walletSlice.actions;

export default walletSlice.reducer;
