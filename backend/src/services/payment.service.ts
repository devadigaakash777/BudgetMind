import { processWithMutator } from "../utils/processWithMutator.js";
import { handleTemporaryWalletRequest } from "../utils/shared.js";

export const handleTempWallet = async (
  userId: string,
  sourceID: string,
  amountRequested: number,
  sourcePreference: 'wishlist' | 'main',
  canDecreaseBudget: boolean,
) => {
  return await processWithMutator(userId, sourceID, handleTemporaryWalletRequest, amountRequested, sourcePreference, canDecreaseBudget);
};
