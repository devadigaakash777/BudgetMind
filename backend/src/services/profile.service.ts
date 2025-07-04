import { BudgetSummary } from "../models/budget.model.js";
import Profile from "../models/profile.model.js";
import { initializeState } from "../utils/shared.js";
import { mergeByExistingKeys } from "../utils/sanitizeByType.js";
import { Wallet } from "../models/wallet.model.js";

export const finalizeProfile = async (userId: string) => {
    // 1. Fetch plain objects
    const budgetDetails = await BudgetSummary.findOne({ userId }).lean();
    if (!budgetDetails) {
        throw new Error(`BudgetSummary not found for user ${userId}`);
    }

    const profileDetails = await Profile.findOne({ userId }).lean();
    if (!profileDetails) {
        throw new Error(`Profile not found for user ${userId}`);
    }

    const walletDetails = await Wallet.findOne({ userId }).lean();
    if (!walletDetails) {
        throw new Error(`Wallet not found for user ${userId}`);
    }

    const state = {
        User: profileDetails,
        ...walletDetails,
        ...budgetDetails
    };

    console.log("Original state:", state);

    const newState = initializeState(
        state,
        walletDetails?.TotalWealth?.amount,
        walletDetails?.threshold
    );
    console.log("Processed state:", newState);

    // Merge and strip _id
    const updatedBudget = mergeByExistingKeys(budgetDetails, newState);
    const updatedProfile = mergeByExistingKeys(profileDetails, newState.User);
    const updatedWallet = mergeByExistingKeys(walletDetails, newState);

    const { _id: _, ...budgetToUpdate } = updatedBudget;
    const { _id: __, ...profileToUpdate } = updatedProfile;
    const { _id: ___, ...walletToUpdate } = updatedWallet;

    // Save to DB (ONLY ONCE)
    await BudgetSummary.updateOne({ userId }, { $set: budgetToUpdate });
    await Profile.updateOne({ userId }, { $set: profileToUpdate });
    await Wallet.updateOne({ userId }, { $set: walletToUpdate });

    return newState;
};
