import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { DailyExpense, DailyExpenseState } from '@/types/daily-expense';

const initialState: DailyExpenseState = {
  data: [],
  page: 0,
  rowsPerPage: 5,
  selectedIds: [],
  numberOfDays: 1,
  totalAmount: 0,
  canReduceBudget: true,
  source: 'main',
  searchText: '',
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
    toggleSelection(state, action: PayloadAction<string>) {
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
      state.selectedIds = state.data.map(item => item._id);
    },
    deselectAll(state) {
      state.selectedIds = [];
    },
    addExpense(state, action: PayloadAction<{ id: string; userId: string; amount: number; details: string; numberOfDays: number }>) {
      const { id, userId, amount, details, numberOfDays } = action.payload;

      state.data.push({
        _id: id,
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
    setSearchText(state, action: PayloadAction<string>) {
      state.searchText = action.payload;
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
  setSearchText
} = dailyExpenseSlice.actions;

export default dailyExpenseSlice.reducer;
