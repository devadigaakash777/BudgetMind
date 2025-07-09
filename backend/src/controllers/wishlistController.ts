import { Request, Response } from 'express';
import { WishlistItem } from '../models/wishlist.model.js';
import { WishlistSummary } from '../models/wishlist.model.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { updateTotalSavedAmount } from '../utils/updateWishlistSummary.js';
import { settlePayback } from '../utils/payback.js';
import { collectAmount } from '../utils/processPayment.js'

export const getWishlist = async (req: AuthRequest, res: Response) => {
  const page = Number(req.query.page) || 0;
  const limit = Number(req.query.limit) || 5;

  const [items, count] = await Promise.all([
    WishlistItem.find({ userId: req.userId })
      .sort({ priority: 1 }) // sort by priority
      .skip(page * limit)
      .limit(limit),
    WishlistItem.countDocuments({ userId: req.userId })
  ]);

  const summary = await WishlistSummary.findOne({ userId: req.userId });

  res.json({
    items,
    totalCount: count,
    totalSavedAmount: summary?.totalSavedAmount || 0
  });
};


export const addWishlistItem = async (req: AuthRequest, res: Response) => {
  const item = new WishlistItem({ ...req.body, userId: req.userId });
  await item.save();
  await updateTotalSavedAmount(req.userId!);
  res.status(201).json(item);
};

export const deleteWishlistItem = async (req: AuthRequest, res: Response): Promise<void> => {
  const item = await WishlistItem.findOne({ _id: req.params.id, userId: req.userId });
  if(!item){
    res.status(404).json("Item not found");
    return;
  }
  await WishlistItem.deleteOne({ _id: req.params.id, userId: req.userId });
  await settlePayback(req.userId!, item.savedAmount!, "wishlist");
  res.sendStatus(204);
};

export const updateFundingStatus = async (req: AuthRequest, res: Response) => {
  const { isFunded } = req.body;
  await WishlistItem.updateOne(
    { _id: req.params.id, userId: req.userId },
    { $set: { isFunded } }
  );
  res.sendStatus(200);
};

export const changePriority = async (req: AuthRequest, res: Response) => {
  const { newPriority } = req.body;

  // Basic swap logic — can be improved
  const current = await WishlistItem.findOne({ _id: req.params.id, userId: req.userId });
  const conflict = await WishlistItem.findOne({ priority: newPriority, userId: req.userId });

  if (conflict) {
    conflict.priority = conflict.priority + 1;
    await conflict.save();
  }

  if (current) {
    current.priority = newPriority;
    await current.save();
  }

  res.sendStatus(200);
};

export const updateMonthLeft = async (req: AuthRequest, res: Response) => {
  const { direction } = req.body; // 'increase' or 'decrease'
  const item = await WishlistItem.findOne({ _id: req.params.id, userId: req.userId });

  if (item) {
    if (direction === 'increase') item.monthLeft += 1;
    if (direction === 'decrease' && item.monthLeft > 1) item.monthLeft -= 1;
    await item.save();
  }

  res.sendStatus(200);
};

export const buyItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = await WishlistItem.findOne({ _id: req.params.id, userId: req.userId });
    const { preference, reduceDailyBudget } = req.body;

    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    const userId = req.userId!;
    const itemId = req.params.id;

    console.log("item id is: ",itemId);

    if (item.savedAmount < item.cost) {
      await collectAmount(userId, itemId, item.cost, item.savedAmount, preference, reduceDailyBudget);
    }
    // await item.deleteOne();
    // await updateTotalSavedAmount(req.userId!);
    res.sendStatus(200);
  } catch (err) {
    console.error('Error in buyItem:', err);
    res.status(500).json({ message: 'Server error while buying item' });
  }
};

export const bulkReorder = async (req: AuthRequest, res: Response) => {
  const { updates } = req.body; // [{ id, priority }]

  const bulkOps = updates.map((item: { id: string; priority: number }) => ({
    updateOne: {
      filter: { _id: item.id, userId: req.userId },
      update: { $set: { priority: item.priority } }
    }
  }));

  await WishlistItem.bulkWrite(bulkOps);
  res.sendStatus(200);
};
