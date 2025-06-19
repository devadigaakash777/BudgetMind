import { createSlice } from '@reduxjs/toolkit';

export type ProcessedState = {
  User: { id: number; hasSalary: boolean };
  MainWallet: { balance: number, isSelected: boolean };
  TemporaryWallet: { balance: number };
  SteadyWallet: {
    balance: number;
    month: number;
    date: number;
    monthlyAmount: number;
  };
  Wishlist: {
    items: {
      id: string;
      savedAmount: number;
      priority: number;
      cost: number;
      monthsToBuy: number;
      isFunded: boolean;
      isSelected: boolean;
    }[];
  };
  DailyBuffer: { balance: number, isSelected: boolean };
  FixedExpenses: {
    expenses: {
      id: number;
      isPaid: boolean;
      amount: number;
      isPermanent: boolean;
      isFunded: boolean;
      durationInMonths: number;
      amountToFund: number;
      isSelected: boolean;
    }[];
  };
  MonthlyBudget: { amount: number };
  DailyBudget: {
    amount: number;
    min: number;
    max: number;
  };
  TotalWealth: { amount: number };
  Salary: { amount: number; date: number };
  PendingPayments: { amount: number };
  threshold: number;
};



const initialState: {
  processedState: ProcessedState | null;
} = {
  processedState: null,
};

const previewSlice = createSlice({
  name: 'preview',
  initialState,
  reducers: {
    setPreview(state, action) {
      state.processedState = action.payload;
    },
    clearPreview(state) {
      state.processedState = null;
    }
  },
});

export const { setPreview, clearPreview } = previewSlice.actions;
export default previewSlice.reducer;