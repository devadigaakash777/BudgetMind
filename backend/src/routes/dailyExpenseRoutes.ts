import express from 'express';
import {
  getUserDailyExpenses,
  addDailyExpenses,
  generateAndAddExpenses,
  downloadUserExpensesExcel
} from '../controllers/dailyExpenseController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getUserDailyExpenses);                // GET /api/expense/
router.post('/bulk-add', addDailyExpenses);                 // POST /api/expense/bulk-add
router.post('/generate-add', generateAndAddExpenses);       // POST /api/expense/generate-add
router.get("/download", downloadUserExpensesExcel);

export default router;
