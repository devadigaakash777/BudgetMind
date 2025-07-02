import { WishlistItem } from '../models/wishlist.model.js';
import { FixedExpense } from '../models/budget.model.js';
import { Wallet } from '../models/wallet.model.js';
import { updateTotalSavedAmount } from './updateWishlistSummary.js'
import { updateFixedExpenseSavedAmount } from './updateFixedExpenseSavedAmount.js'

export const settlePayback = async (userId: string, amount: number, type: 'wishlist' | 'expense') => {
  if (amount > 0) {
    await Wallet.findOneAndUpdate(
      { userId },
      { $inc: { 'TemporaryWallet.balance': amount } },
      { new: true }
    );
  }
  if (type === 'wishlist') {
    await updateTotalSavedAmount(userId!);
  } else if (type === 'expense') {
    await updateFixedExpenseSavedAmount(userId!);
  }
};
