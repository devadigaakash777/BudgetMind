// services/expense.service.ts
import { processWithMutator } from "../utils/processWithMutator.js";
import { logExtendedExpense, handleTemporaryWalletRequest } from "../utils/shared.js";

export const processDailyExpense = async (
  expense: { amount: number; duration?: number },
  date: Date,
  userId: string,
  details: string
) => {
  return await processWithMutator(userId, logExtendedExpense, expense, date, userId, details);
};

export const handleTempWallet = async (
  userId: string,
  amountRequested: number,
  sourcePreference: 'wishlist' | 'main',
  canDecreaseBudget: boolean,
) => {
  return await processWithMutator(userId, handleTemporaryWalletRequest, amountRequested, sourcePreference, canDecreaseBudget);
};

