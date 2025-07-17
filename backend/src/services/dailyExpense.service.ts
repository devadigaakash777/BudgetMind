import { processWithMutator } from "../utils/processWithMutator.js";
import { logExtendedExpense, handleTemporaryWalletRequest } from "../utils/shared.js";

export const processDailyExpense = async (
  expense: { amount: number; duration?: number },
  date: Date,
  userId: string,
  details: string,
  daysBetween: number | null
) => {
  return await processWithMutator(userId, null, logExtendedExpense, expense, date, userId, details, daysBetween);
};

export const handleTempWallet = async (
  userId: string,
  amountRequested: number,
  sourcePreference: 'wishlist' | 'main',
  canDecreaseBudget: boolean,
  hasBudgetPaid: boolean,
  unpaidDays: number,
) => {
  return await processWithMutator(userId, null, handleTemporaryWalletRequest, amountRequested, sourcePreference, canDecreaseBudget, hasBudgetPaid, unpaidDays);
};

