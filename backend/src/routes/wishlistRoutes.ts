import express from 'express';
import {
  getWishlist,
  addWishlistItem,
  deleteWishlistItem,
  updateFundingStatus,
  changePriority,
  updateMonthLeft,
  buyItem,
  bulkReorder
} from '../controllers/wishlistController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth); // Protect all

router.get('/', getWishlist);
router.post('/', addWishlistItem);
router.delete('/:id', deleteWishlistItem);
router.patch('/:id/fund', updateFundingStatus);
router.patch('/:id/priority', changePriority);
router.patch('/:id/month', updateMonthLeft);
router.post('/:id/buy', buyItem);
router.patch('/bulk-reorder', bulkReorder);

export default router;
