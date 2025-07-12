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
  resetUserData
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

export default router;
