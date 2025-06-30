import { WishlistItem } from '../models/wishlist.model.js';
import { WishlistSummary } from '../models/wishlist.model.js';

export const updateTotalSavedAmount = async (userId: string) => {
  const items = await WishlistItem.find({ userId });
  const total = items.reduce((sum, item) => sum + item.savedAmount, 0);

  await WishlistSummary.findOneAndUpdate(
    { userId },
    { totalSavedAmount: total },
    { upsert: true }
  );
};
