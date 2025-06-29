import express from 'express';
import {
  getWallet,
  updateMainWallet,
  updateTempWallet,
  updateSteadyWallet,
  updateTotalWealth,
  updateThreshold
} from '../controllers/walletController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getWallet);
router.post('/main', updateMainWallet);
router.post('/temp', updateTempWallet);
router.post('/steady', updateSteadyWallet);
router.post('/total-wealth', updateTotalWealth);
router.post('/threshold', updateThreshold);

export default router;
