import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  MonthlyBudget: { amount: 0 },
  DailyBudget: { amount: 0, min: 0, max: 0 },
  FixedExpenses: { expenses: [
    { id: 1, billName:"Electricity Bill", status:"pending" , dueDate:"2025-06-28", isPaid: false, amount: 1500, isPermanent: true, isFunded: false, durationInMonths: 3, amountToFund: 1500 },
    { id: 2, billName:"Bike EMI", status:"paid" , isPaid: true, dueDate:"2025-06-18",amount: 2000, isPermanent: true, isFunded: false, durationInMonths: 1, amountToFund: 2000 },
    { id: 3, billName:"Rent", status:"expired" , isPaid: false, dueDate:"2025-06-16",amount: 8000, isPermanent: true, isFunded: false, durationInMonths: 2, amountToFund: 800 }
  ] },
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    updateBudgetState(state, action) {
      return { ...state, ...action.payload };
    }
  },
});

export const { updateBudgetState } = budgetSlice.actions;
export default budgetSlice.reducer;