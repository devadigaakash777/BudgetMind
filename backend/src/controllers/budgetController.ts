import { Request, Response } from 'express';
import { BudgetSummary, FixedExpense } from '../models/budget.model.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { updateFixedExpenseSavedAmount } from '../utils/updateFixedExpenseSavedAmount.js'

// --- Budget Summary ---

export const getBudgetSummary = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const page = Number(req.query.page) || 0;

  // Fetch summary or create one if not found
  let summary = await BudgetSummary.findOne({ userId });
  if (!summary) {
    summary = new BudgetSummary({
      userId,
      FixedExpenses: { rowsPerPage: 3, totalSavedAmount: 0 }
    });
    await summary.save();
  }

  const limit = summary.FixedExpenses?.rowsPerPage || 5;

  // Fetch paginated expenses and count
  const [expenses, totalCount] = await Promise.all([
    FixedExpense.find({ userId })
      .sort({ dueDate: 1 })
      .skip(page * limit)
      .limit(limit),
    FixedExpense.countDocuments({ userId })
  ]);

  // Merge summary and expenses correctly
  const fullSummary = {
    MonthlyBudget: summary.monthlyBudget,
    DailyBudget: summary.dailyBudget,
    FixedExpenses: {
      expenses,
      rowsPerPage: summary.FixedExpenses?.rowsPerPage || 3,
      totalSavedAmount: summary.FixedExpenses?.totalSavedAmount || 0
    },
    _id: summary._id,
    userId: summary.userId,
    __v: summary.__v
  };

  res.json({
    summary: fullSummary,
    totalCount
  });
};




export const updateBudgetSummary = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const update = req.body;

  const summary = await BudgetSummary.findOneAndUpdate(
    { userId },
    { $set: update },
    { new: true, upsert: true }
  );

  res.json(summary);
};

export const updateDailyBudget = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { setAmount, minAmount, maxAmount } = req.body;

  const summary = await BudgetSummary.findOneAndUpdate(
    { userId },
    {
      $set: {
        'dailyBudget.setAmount': setAmount,
        'dailyBudget.min': minAmount,
        'dailyBudget.max': maxAmount
      }
    },
    { new: true, upsert: true }
  );

  res.json(summary);
};

// --- Fixed Expenses ---

export const getFixedExpenses = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const expenses = await FixedExpense.find({ userId });
  res.json(expenses);
};

export const addFixedExpense = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const expense = new FixedExpense({ ...req.body, userId });
  await expense.save();
  await updateFixedExpenseSavedAmount(userId);
  res.status(201).json(expense);
};

export const deleteFixedExpense = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;
  await FixedExpense.deleteOne({ _id: id, userId });
  await updateFixedExpenseSavedAmount(userId);
  res.sendStatus(204);
};

export const payFixedExpense = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;

  const expense = await FixedExpense.findOne({ _id: id, userId });
  if (!expense) {
    res.status(404).json({ message: 'Expense not found' });
  }
  else {
    if (expense.isFunded && !expense.isPaid) {
        expense.isPaid = true;
        expense.status = 'paid';
        await expense.save();
    }
    res.sendStatus(204);
  }
};

export const updateExpenseDuration = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;
  const { type } = req.body; // "increase" or "decrease"

  const expense = await FixedExpense.findOne({ _id: id, userId });
  if (!expense) 
    res.status(404).json({ message: 'Expense not found' });
  else{
    if (type === 'increase') {
        expense.durationInMonths += 1;
    } else if (type === 'decrease' && expense.durationInMonths > 1) {
        expense.durationInMonths -= 1;
    }
    await expense.save();
    res.sendStatus(204);
  }
};
