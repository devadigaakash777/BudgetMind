import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
}

const initialState: DailyExpenseState = {
  data: [
    { id: 1, userId: 1, amount: 110, date: '2025-06-01', details: '', balance: 900, amountStatus: 'above', amountDifference: 10 },
    { id: 2, userId: 1, amount: 100, date: '2025-06-02', details: '', balance: 800, amountStatus: 'equal', amountDifference: 0 },
    { id: 3, userId: 1, amount: 50, date: '2025-06-03', details: '', balance: 750, amountStatus: 'below', amountDifference: 50 },
    { id: 4, userId: 1, amount: 50, date: '2025-06-04', details: '', balance: 700, amountStatus: 'below', amountDifference: 50 },
    { id: 5, userId: 1, amount: 110, date: '2025-06-05', details: '', balance: 900, amountStatus: 'above', amountDifference: 10 },
    { id: 6, userId: 1, amount: 100, date: '2025-06-06', details: '', balance: 800, amountStatus: 'equal', amountDifference: 0 },
    { id: 7, userId: 1, amount: 50, date: '2025-06-07', details: '', balance: 750, amountStatus: 'below', amountDifference: 50 },
    { id: 8, userId: 1, amount: 50, date: '2025-06-08', details: '', balance: 700, amountStatus: 'below', amountDifference: 50 },
    { id: 9, userId: 1, amount: 110, date: '2025-06-09', details: '', balance: 900, amountStatus: 'above', amountDifference: 10 },
    { id: 10, userId: 1, amount: 100, date: '2025-06-10', details: '', balance: 800, amountStatus: 'equal', amountDifference: 0 },
    { id: 11, userId: 1, amount: 50, date: '2025-06-11', details: '', balance: 750, amountStatus: 'below', amountDifference: 50 },
    { id: 12, userId: 1, amount: 50, date: '2025-06-12', details: '', balance: 700, amountStatus: 'below', amountDifference: 50 },
    { id: 13, userId: 1, amount: 110, date: '2025-06-13', details: '', balance: 900, amountStatus: 'above', amountDifference: 10 },
    { id: 14, userId: 1, amount: 100, date: '2025-06-14', details: '', balance: 800, amountStatus: 'equal', amountDifference: 0 },
    { id: 15, userId: 1, amount: 50, date: '2025-06-15', details: '', balance: 750, amountStatus: 'below', amountDifference: 50 },
    { id: 16, userId: 1, amount: 50, date: '2025-06-16', details: '', balance: 700, amountStatus: 'below', amountDifference: 50 }
  ],
  page: 0,
  rowsPerPage: 5,
  selectedIds: [],
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
  },
});

export const {
  setDailyExpense,
  setPage,
  setRowsPerPage,
  toggleSelection,
  selectAll,
  deselectAll,
} = dailyExpenseSlice.actions;

export default dailyExpenseSlice.reducer;
