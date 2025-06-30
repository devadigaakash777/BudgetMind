import express from 'express';
import {
  getBudgetSummary,
  updateBudgetSummary,
  updateDailyBudget,
  getFixedExpenses,
  addFixedExpense,
  deleteFixedExpense,
  payFixedExpense,
  updateExpenseDuration
} from '../controllers/budgetController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

// Budget Summary
router.get('/summary', getBudgetSummary);
router.post('/summary', updateBudgetSummary);
router.patch('/daily-budget', updateDailyBudget);

// Fixed Expenses
router.get('/expenses', getFixedExpenses);
router.post('/expenses', addFixedExpense);
router.delete('/expenses/:id', deleteFixedExpense);
router.patch('/expenses/:id/pay', payFixedExpense);
router.patch('/expenses/:id/duration', updateExpenseDuration);

export default router;
