/* eslint-disable unicorn/consistent-function-scoping */

import { AppDispatch, RootState } from '../store';
import { setPreview } from '../slices/preview-slice';
import type { BudgetState } from '@/types/budget';
import { logExtendedExpense, handleTemporaryWalletRequest, monthlyAllocate, getNextSalaryDateISO } from '@/utils/shared';
import { PreviewState } from '@/types/preview'

type ExpenseInput = {
  amount: number;
  duration?: number;
};

type requestMoneyResult = {
  newState: PreviewState;
  collected: number;
};

type LogExpenseResult = {
  newState: PreviewState;
  overage: number;
};


// eslint-disable-next-line unicorn/consistent-function-scoping
export const syncPreview = 
  () => (dispatch: AppDispatch, getState: () => RootState) => {
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

// eslint-disable-next-line unicorn/consistent-function-scoping
export const addPreviewExpense = function (expense: ExpenseInput) {
  return function (dispatch: AppDispatch, getState: () => RootState) {
    const state = getState().preview;
    const date = new Date();
    const { newState } = logExtendedExpense(state, expense, date,  "user", " ") as LogExpenseResult;
    if (newState.DailyBudget) {
      newState.DailyBudget.amount = Math.max(0, newState.DailyBudget.amount - expense.amount);
    }
    console.log(newState);
    dispatch(setPreview(newState));
  };
};


// eslint-disable-next-line unicorn/consistent-function-scoping
export const requestMoney = function (amount: number, source: string, canDecrease: boolean) {
  return function (dispatch: AppDispatch, getState: () => RootState) {
    const state = getState().preview;
    const { newState } = handleTemporaryWalletRequest(state, amount, source, canDecrease) as requestMoneyResult;
    console.log(newState);
    dispatch(setPreview(newState));
  };
};

