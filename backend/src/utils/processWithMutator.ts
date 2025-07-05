// utils/processWithMutator.ts
import { BudgetSummary, FixedExpense } from "../models/budget.model.js";
import Profile from "../models/profile.model.js";
import { Wallet } from "../models/wallet.model.js";
import { WishlistSummary, WishlistItem } from "../models/wishlist.model.js";
import { mergeByExistingKeys } from "./sanitizeByType.js";

export const processWithMutator = async (
  userId: string,
  mutator: Function,
  ...mutatorArgs: any[]
) => {
  // Fetch all required data
  const [budgetDetails, expenses, profileDetails, walletDetails, wishlistDetails, items] =
    await Promise.all([
      BudgetSummary.findOne({ userId }).lean(),
      FixedExpense.find({ userId }).lean(),
      Profile.findOne({ userId }).lean(),
      Wallet.findOne({ userId }).lean(),
      WishlistSummary.findOne({ userId }).lean(),
      WishlistItem.find({ userId }).lean()
    ]);

  if (!budgetDetails) throw new Error(`BudgetSummary not found for user ${userId}`);
  if (!profileDetails) throw new Error(`Profile not found for user ${userId}`);
  if (!walletDetails) throw new Error(`Wallet not found for user ${userId}`);
  if (!wishlistDetails) throw new Error(`WishlistSummary not found for user ${userId}`);
  if (!expenses || !items) throw new Error(`Expenses or WishlistItems missing for ${userId}`);

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

  const newState = mutator(state, ...mutatorArgs);

//   const updatedBudget = mergeByExistingKeys(budgetDetails, newState);
//   const updatedWallet = mergeByExistingKeys(walletDetails, newState);

//   const updatedExpensesArray = expenses.map(exp => {
//     const updated = mergeByExistingKeys(
//       exp,
//       newState.FixedExpenses.expenses.find((e: { _id: { toString: () => string; }; }) => e._id.toString() === exp._id.toString()) || {}
//     );
//     const { _id, ...rest } = updated;
//     return {
//       updateOne: {
//         filter: { _id },
//         update: { $set: rest }
//       }
//     };
//   });

//   const updatedItemsArray = items.map(item => {
//     const updated = mergeByExistingKeys(
//       item,
//       newState.Wishlist.items.find((i: { _id: { toString: () => string; }; }) => i._id.toString() === item._id.toString()) || {}
//     );
//     const { _id, ...rest } = updated;
//     return {
//       updateOne: {
//         filter: { _id },
//         update: { $set: rest }
//       }
//     };
//   });

//   const { _id: _, ...budgetToUpdate } = updatedBudget;
//   const { _id: __, ...walletToUpdate } = updatedWallet;

//   const totalSavedAmount = newState.Wishlist.totalSavedAmount;

//   await WishlistSummary.updateOne({ userId },{ $set: { totalSavedAmount } });
//   await BudgetSummary.updateOne({ userId }, { $set: budgetToUpdate });
//   await Wallet.updateOne({ userId }, { $set: walletToUpdate });
//   await FixedExpense.bulkWrite(updatedExpensesArray);
//   await WishlistItem.bulkWrite(updatedItemsArray);

  return newState.data ?? newState;
};
