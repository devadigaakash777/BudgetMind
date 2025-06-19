import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  MainWallet: { balance: 10000 },
  TemporaryWallet: { balance: 1000 },
  SteadyWallet: { balance: 0, month: 4, date: 1, monthlyAmount: 0 },
  DailyBuffer: { balance: 0 },
  TotalWealth: { amount: 0 },
  PendingPayments: { amount: 0 }
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    updateWalletState(state, action) {
      return { ...state, ...action.payload };
    }
  },
});

export const { updateWalletState } = walletSlice.actions;
export default walletSlice.reducer;
