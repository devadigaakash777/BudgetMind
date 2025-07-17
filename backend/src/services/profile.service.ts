import { BudgetSummary, FixedExpense } from "../models/budget.model.js";
import Profile from "../models/profile.model.js";
import { initializeState, monthlyAllocate, reAllocateBudget } from "../utils/shared.js";
import { mergeByExistingKeys } from "../utils/sanitizeByType.js";
import { Wallet } from "../models/wallet.model.js";
import { processWithMutator } from "../utils/processWithMutator.js";
import mongoose from 'mongoose';
import DailyExpense from "../models/expense.model.js";
import { getDaysSinceLastExpense } from "../utils/expensePending.js";

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

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        await BudgetSummary.updateOne({ userId }, { $set: budgetToUpdate });
        await Profile.updateOne({ userId }, { $set: profileToUpdate });
        await Wallet.updateOne({ userId }, { $set: walletToUpdate });
        await session.commitTransaction();
        session.endSession();
        console.log("All updates applied successfully.");
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error("Transaction aborted due to error:", err);
        throw err;
    }
    return newState;
};


export const finalizeSalary = async (userId: string) => {
    const profileDetails = await Profile.findOne({ userId }).lean();
    if (!profileDetails) {
        throw new Error(`Profile not found for user ${userId}`);
    }

    const budgetDetails = await BudgetSummary.findOne({ userId }).lean();

    const walletDetails = await Wallet.findOne({ userId }).lean();
    if (!walletDetails) {
        throw new Error(`Wallet not found for user ${userId}`);
    }
    const salary = profileDetails.hasSalary ? profileDetails?.salary?.amount : walletDetails.SteadyWallet.monthlyAmount;
    const userDailyBudget = budgetDetails?.DailyBudget?.setAmount === 0
    ? null
    : budgetDetails?.DailyBudget?.setAmount ?? null;

    return await processWithMutator(userId, null, monthlyAllocate, new Date(), salary, userDailyBudget);
};

export const allocateBudget = async (userId: string) => {
    const todayDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const existingExpenses = await DailyExpense.findOne({ userId, date: todayDate });

    let hasBudgetPaid = existingExpenses ? true : false;
    const daysBetween = await getDaysSinceLastExpense(userId) || 0;
    return await processWithMutator(userId, null, reAllocateBudget, daysBetween);
}