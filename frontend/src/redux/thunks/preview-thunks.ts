// previewThunks.ts
import { AppDispatch, RootState } from '../store';
import { setPreview } from '../slices/preview-slice';
import type { BudgetState } from '@/types/budget';
import { logExtendedExpense, handleTemporaryWalletRequest } from '@/utils/shared';

type ExpenseInput = {
  amount: number;
  duration?: number;
};

type requestMoneyResult = {
  newState: any;
  collected: any;
};

type LogExpenseResult = {
  newState: any;
  overage: number;
};



export const syncPreview = () => (dispatch: AppDispatch, getState: () => RootState) => {
  const state = getState();
  const flatPreview = {
    User: state.user,     // user slice
    ...state.budget as (BudgetState),       // budget slice
    DailyExpense: state.expense,     // daily expense slice
    ...state.wallet,     // wallets slice
    Wishlist: state.wishlist     // wishlist slice
  };

  dispatch(setPreview(flatPreview));
};

export const addPreviewExpense =
  (expense: ExpenseInput) => (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState().preview;
    const date = new Date();
    const { newState } = logExtendedExpense(state, expense, date) as LogExpenseResult;
    newState.DailyBudget.amount = Math.max(0, newState.DailyBudget.amount - expense.amount);
    console.log(newState);
    dispatch(setPreview(newState));
  };

export const requestMoney =
  (amount: number, source: string, canDecrease: boolean) => (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState().preview;
    const { newState } = handleTemporaryWalletRequest(state, amount, source, canDecrease) as requestMoneyResult;
    console.log(newState);
    dispatch(setPreview(newState));
  };