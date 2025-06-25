import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { stat } from 'fs';

export interface DailyExpense {
  id: number;
  userId: number;
  amount: number;
  date: string;
  details: string;
  balance: number;
  amountStatus: 'above' | 'equal' | 'below';
  amountDifference: number;
}

interface DailyExpenseState {
  data: DailyExpense[];
  page: number;
  rowsPerPage: number;
  selectedIds: number[];
  numberOfDays: number;
  totalAmount: number,
  canReduceBudget: boolean,
  source: 'wishlist' | 'main',
}

const initialState: DailyExpenseState = {
  data: [
    // May 2025
    { id: 1, userId: 1, amount: 100, date: '2025-05-01', details: '', balance: 900, amountStatus: 'equal', amountDifference: 0 },
    { id: 2, userId: 1, amount: 150, date: '2025-05-02', details: '', balance: 850, amountStatus: 'above', amountDifference: 50 },
    { id: 3, userId: 1, amount: 90,  date: '2025-05-03', details: '', balance: 810, amountStatus: 'below', amountDifference: 10 },
    { id: 4, userId: 1, amount: 120, date: '2025-05-04', details: '', balance: 780, amountStatus: 'above', amountDifference: 20 },
    { id: 5, userId: 1, amount: 100, date: '2025-05-05', details: '', balance: 750, amountStatus: 'equal', amountDifference: 0 },
    { id: 6, userId: 1, amount: 70,  date: '2025-05-06', details: '', balance: 720, amountStatus: 'below', amountDifference: 30 },
    { id: 7, userId: 1, amount: 130, date: '2025-05-07', details: '', balance: 690, amountStatus: 'above', amountDifference: 30 },
    { id: 8, userId: 1, amount: 90,  date: '2025-05-08', details: '', balance: 660, amountStatus: 'below', amountDifference: 10 },

    // June 2025
    { id: 9,  userId: 1, amount: 110, date: '2025-06-01', details: '', balance: 900, amountStatus: 'above', amountDifference: 10 },
    { id: 10, userId: 1, amount: 100, date: '2025-06-02', details: '', balance: 800, amountStatus: 'equal', amountDifference: 0 },
    { id: 11, userId: 1, amount: 50,  date: '2025-06-03', details: '', balance: 750, amountStatus: 'below', amountDifference: 50 },
    { id: 12, userId: 1, amount: 50,  date: '2025-06-04', details: '', balance: 700, amountStatus: 'below', amountDifference: 50 },
    { id: 13, userId: 1, amount: 110, date: '2025-06-05', details: '', balance: 900, amountStatus: 'above', amountDifference: 10 },
    { id: 14, userId: 1, amount: 100, date: '2025-06-06', details: '', balance: 800, amountStatus: 'equal', amountDifference: 0 },
    { id: 15, userId: 1, amount: 50,  date: '2025-06-07', details: '', balance: 750, amountStatus: 'below', amountDifference: 50 },
    { id: 16, userId: 1, amount: 50,  date: '2025-06-08', details: '', balance: 700, amountStatus: 'below', amountDifference: 50 }
  ],
  page: 0,
  rowsPerPage: 5,
  selectedIds: [],
  numberOfDays: 1,
  totalAmount: 0,
  canReduceBudget: true,
  source: 'main',
};


const dailyExpenseSlice = createSlice({
  name: 'dailyExpense',
  initialState,
  reducers: {
    setDailyExpense(state, action: PayloadAction<DailyExpense[]>) {
      state.data = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setRowsPerPage(state, action: PayloadAction<number>) {
      state.rowsPerPage = action.payload;
    },
    toggleSelection(state, action: PayloadAction<number>) {
      const id = action.payload;
      if (state.selectedIds.includes(id)) {
        // remove the id
        state.selectedIds = state.selectedIds.filter(existingId => existingId !== id);
      } else {
        // add the id
        state.selectedIds.push(id);
      }
    },
    selectAll(state) {
      state.selectedIds = state.data.map(item => item.id);
    },
    deselectAll(state) {
      state.selectedIds = [];
    },
    addExpense(state, action: PayloadAction<{ id: number; userId: number; amount: number; details: string; numberOfDays: number }>) {
      const { id, userId, amount, details, numberOfDays } = action.payload;

      state.data.push({
        id: id,
        userId: userId,
        amount: 0,
        date: '',             
        details: details,
        balance: 0,           
        amountStatus: 'equal',
        amountDifference: 0,  
      });
      state.totalAmount = amount;
      state.numberOfDays = numberOfDays;
    },
    selectSource(state, action: PayloadAction<'wishlist' | 'main'>) {
      state.source = action.payload;
    },
    reduceBudget(state, action: PayloadAction<boolean>) {
      state.canReduceBudget = action.payload;
    },
  },
});

export const {
  setDailyExpense,
  setPage,
  setRowsPerPage,
  toggleSelection,
  selectAll,
  deselectAll,
  addExpense,
  selectSource,
  reduceBudget,
} = dailyExpenseSlice.actions;

export default dailyExpenseSlice.reducer;
