import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  updateBasicProfile,
  updateSalary,
  updateAvatar,
  markProfileComplete,
  markSalaryPaid,
  getUserProfile,
  calculateProfile,
  resetUserData,
  resetBudget
} from '../controllers/profileController.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getUserProfile);
router.post('/calculate', calculateProfile);
router.put('/basic', updateBasicProfile);
router.put('/salary', updateSalary);
router.patch('/avatar', updateAvatar);
router.patch('/status/profile', markProfileComplete);
router.patch('/status/salary', markSalaryPaid);
router.post('/reset', resetUserData);
router.post('/re-allocate-budget', resetBudget);

export default router;
