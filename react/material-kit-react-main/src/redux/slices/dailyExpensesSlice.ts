import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  expense: [
    { id: 1, userId : 1, amount: 110, date: "2025-06-16" ,details: "", balance: 900, amountStatus: "above", amountDifference:10},
    { id: 2, userId : 1, amount: 100, date: "2025-06-17" ,details: "", balance: 800, amountStatus: "equal", amountDifference:0},
    { id: 3, userId : 1, amount: 50, date: "2025-06-18" ,details: "", balance: 750, amountStatus: "below", amountDifference:50},
    { id: 4, userId : 1, amount: 50, date: "2025-06-19" ,details: "", balance: 700, amountStatus: "below", amountDifference:50}
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