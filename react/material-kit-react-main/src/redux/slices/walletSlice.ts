import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  MainWallet: { balance: 7000 },
  TemporaryWallet: { balance: 1000 },
  SteadyWallet: { balance: 5000, month: 4, date: 1, monthlyAmount: 5000 },
  DailyBuffer: { balance: 1000 },
  TotalWealth: { amount: 0 },
  PendingPayments: { amount: 0 },
  threshold: 0
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    updateWalletState(state, action) {
      return { ...state, ...action.payload };
    },
    updateSteadyWallet(state, action) {
      const { month, date, monthlyAmount } = action.payload;
      state.SteadyWallet.month = month !== undefined ? month : state.SteadyWallet.month;
      state.SteadyWallet.date = date !== undefined ? date : state.SteadyWallet.date;
      state.SteadyWallet.monthlyAmount =
        monthlyAmount !== undefined ? monthlyAmount : state.SteadyWallet.monthlyAmount;
    },
    setThreshold(state, action) {
      const { threshold } = action.payload;
      state.threshold = threshold;
      state.MainWallet.balance = threshold;
    },
    updateMainWallet(state, action) {
      const { balance } = action.payload;
      state.MainWallet.balance = balance !== undefined ? balance : state.MainWallet.balance;
    }
  },
});

export const { updateWalletState, updateSteadyWallet, updateMainWallet, setThreshold } = walletSlice.actions;
export default walletSlice.reducer;
