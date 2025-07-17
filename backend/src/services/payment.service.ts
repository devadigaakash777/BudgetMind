import { processWithMutator } from "../utils/processWithMutator.js";
import { collectAmount } from "../utils/shared.js";

export const handleTempWallet = async (
  userId: string,
  sourceID: string,
  amountRequested: number,
  sourcePreference: 'wishlist' | 'main',
  canDecreaseBudget: boolean,
  hasBudgetPaid: boolean,
  unpaidDays: number,
) => {
  return await processWithMutator(userId, sourceID, collectAmount, amountRequested, sourcePreference, canDecreaseBudget, hasBudgetPaid, unpaidDays);
};
