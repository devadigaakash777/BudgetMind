// utils/processWithMutator.ts
import { BudgetSummary, FixedExpense } from "../models/budget.model.js";
import Profile from "../models/profile.model.js";
import { Wallet } from "../models/wallet.model.js";
import { WishlistSummary, WishlistItem } from "../models/wishlist.model.js";
import { mergeByExistingKeys } from "./sanitizeByType.js";
import mongoose from 'mongoose';

export const processWithMutator = async (
  userId: string,
  sourceID: string | null,
  mutator: Function,
  ...mutatorArgs: any[]
) => {
  
  // Fetch all required data
  const [budgetDetails, expensesDetails, profileDetails, walletDetails, Wishlist, itemsDetails] =
    await Promise.all([
      BudgetSummary.findOne({ userId }).lean(),
      FixedExpense.find({ userId }).lean().then(expenses =>
        sourceID
          ? expenses.filter(exp => exp._id.toString() !== sourceID)
          : expenses
      ),
      Profile.findOne({ userId }).lean(),
      Wallet.findOne({ userId }).lean(),
      WishlistSummary.findOne({ userId }).lean(),
      WishlistItem.find({ userId }).lean().then(items =>
        sourceID
          ? items.filter(item => item._id.toString() !== sourceID)
          : items
      )
    ]);

  if (!budgetDetails) throw new Error(`BudgetSummary not found for user ${userId}`);
  if (!profileDetails) throw new Error(`Profile not found for user ${userId}`);
  if (!walletDetails) throw new Error(`Wallet not found for user ${userId}`);

  const wishlistDetails = Wishlist ? Wishlist : { totalSavedAmount: 0 };
  const expenses = expensesDetails ? expensesDetails : [];
  const items = itemsDetails ? itemsDetails : [];

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

  console.log("state when called");
  console.log(state);
  const result = mutator(state, ...mutatorArgs);
  const newState = result.newState || result;
  console.log(newState);

  const updatedBudget = mergeByExistingKeys(budgetDetails, newState);
  const updatedWallet = mergeByExistingKeys(walletDetails, newState);

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

  const totalSavedAmount = newState.Wishlist.totalSavedAmount;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await WishlistSummary.updateOne(
      { userId },
      { $set: { totalSavedAmount } },
      { session }
    );

    await BudgetSummary.updateOne(
      { userId },
      { $set: budgetToUpdate },
      { session }
    );

    await Wallet.updateOne(
      { userId },
      { $set: walletToUpdate },
      { session }
    );

    await FixedExpense.bulkWrite(updatedExpensesArray, { session });

    await WishlistItem.bulkWrite(updatedItemsArray, { session });

    await session.commitTransaction();
    session.endSession();
    console.log("All updates applied successfully.");
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction aborted due to error:", err);
    throw err;
  }
  return result;
};
