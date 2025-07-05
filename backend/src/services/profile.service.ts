import { BudgetSummary, FixedExpense } from "../models/budget.model.js";
import Profile from "../models/profile.model.js";
import { initializeState, monthlyAllocate } from "../utils/shared.js";
import { mergeByExistingKeys } from "../utils/sanitizeByType.js";
import { Wallet } from "../models/wallet.model.js";
import { WishlistSummary, WishlistItem } from "../models/wishlist.model.js";

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


export const finalizeSalary = async (userId: string) => {
    // 1. Fetch plain objects
    const budgetDetails = await BudgetSummary.findOne({ userId }).lean();
    if (!budgetDetails) {
        throw new Error(`BudgetSummary not found for user ${userId}`);
    }

    const expenses = await FixedExpense.find({ userId }).lean();
    if (!expenses) {
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

    const wishlistDetails = await WishlistSummary.findOne({ userId }).lean();
    if (!wishlistDetails) {
        throw new Error(`Wallet not found for user ${userId}`);
    }

    const items = await WishlistItem.find({ userId }).lean();
    if (!items) {
        throw new Error(`Wallet not found for user ${userId}`);
    }

    const state = {
        User: profileDetails,
        ...walletDetails,
        MonthlyBudget: budgetDetails.MonthlyBudget,
        DailyBudget: budgetDetails.DailyBudget,
        FixedExpenses: {
        expenses,
        totalSavedAmount: budgetDetails.FixedExpenses?.totalSavedAmount || 0
        },
        Wishlist: {
            items,
            totalSavedAmount: wishlistDetails?.totalSavedAmount || 0
        }
    };

    const newState = monthlyAllocate(
        state,
        new Date(),
        profileDetails?.salary?.amount,
    );

    console.log(JSON.stringify(newState, null, 2));

    // // Merge and strip _id
    const updatedBudget = mergeByExistingKeys(budgetDetails, newState);
    // const updatedProfile = mergeByExistingKeys(profileDetails, newState.User);
    const updatedWallet = mergeByExistingKeys(walletDetails, newState);

    const totalSavedAmount = newState.Wishlist.totalSavedAmount;
    
    const updatedExpensesArray = expenses.map(exp => {
    const updated = mergeByExistingKeys(
        exp,
        newState.FixedExpenses.expenses.find((e: { _id: { toString: () => string; }; }) => e._id.toString() === exp._id.toString()) || {}
    );
    const { _id, ...rest } = updated;
    return {
        updateOne: {
        filter: { _id },
        update: { $set: rest }
        }
    };
    });


    const updatedItemsArray = items.map(item => {
    const updated = mergeByExistingKeys(
        item,
        newState.Wishlist.items.find((i: { _id: { toString: () => string; }; }) => i._id.toString() === item._id.toString()) || {}
    );
    const { _id, ...rest } = updated;
    return {
        updateOne: {
        filter: { _id },
        update: { $set: rest }
        }
    };
    });

    const { _id: _, ...budgetToUpdate } = updatedBudget;
    const { _id: __, ...walletToUpdate } = updatedWallet;

    // Save to DB (ONLY ONCE)
    await BudgetSummary.updateOne({ userId }, { $set: budgetToUpdate });
    await Wallet.updateOne({ userId }, { $set: walletToUpdate });
    await WishlistSummary.updateOne({ userId },{ $set: { totalSavedAmount } });

    await FixedExpense.bulkWrite(updatedExpensesArray);
    await WishlistItem.bulkWrite(updatedItemsArray);
    return newState;
};
