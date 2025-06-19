import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  expense: [
    { id: 1, userId : 1, amount: 100, date: "2025-06-16"},
    { id: 1, userId : 1, amount: 100, date: "2025-06-17"},
    { id: 1, userId : 1, amount: 100, date: "2025-06-18"},
    { id: 1, userId : 1, amount: 100, date: "2025-06-19"}
  ],
};

const dailyExpenseSlice = createSlice({
  name: 'dailyExpense',
  initialState,
  reducers: {
    setDailyExpense(state, action) {
      state.expense = action.payload;
    }
  },
});

export const { setDailyExpense } = dailyExpenseSlice.actions;
export default dailyExpenseSlice.reducer;