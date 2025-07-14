import { Request, Response } from 'express';
import { BudgetSummary, FixedExpense } from '../models/budget.model.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { settlePayback } from '../utils/payback.js';
import { updateFixedExpenseSavedAmount } from '../utils/updateFixedExpenseSavedAmount.js';
import { collectAmount } from '../utils/processPayment.js';

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
    MonthlyBudget: summary.MonthlyBudget,
    DailyBudget: summary.DailyBudget,
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
        'DailyBudget.setAmount': setAmount,
        'DailyBudget.min': minAmount,
        'DailyBudget.max': maxAmount
      }
    },
    { new: true, upsert: true }
  );
  console.log(summary);
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

export const deleteFixedExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId!;
  const { id } = req.params;
  const expense = await FixedExpense.findOne({ _id: req.params.id, userId: req.userId });
  if(!expense){
    res.status(404).json("Expense item not found");
    return;
  }
  const savedAmount = expense.isPaid ? 0 : expense.amount - expense.amountToFund;
  await FixedExpense.deleteOne({ _id: id, userId });
  await settlePayback(req.userId!, savedAmount, "expense");
  res.sendStatus(204);
};

export const payFixedExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId!;
  const { id } = req.params;
  const { preference, reduceDailyBudget } = req.body;

  const expense = await FixedExpense.findOne({ _id: id, userId });
  if (!expense) {
    res.status(404).json({ message: 'Expense not found' });
    return;
  }
  try {
    if (!expense.isPaid) {
        if (!expense.isFunded){
          const savedAmount = expense.amount - expense.amountToFund;
          await collectAmount(userId, id, expense.amount, savedAmount, preference, reduceDailyBudget);
          expense.isFunded = true;
        }
        expense.isPaid = true;
        expense.status = 'paid';
        expense.amountToFund = expense.amount;
        await expense.save();
        await updateFixedExpenseSavedAmount(userId);
    }
    res.status(204).json({ message: 'Successfully paid' });
  }
  catch (err) {
    console.error('Error in payment:', err);
    res.status(500).json({ message: 'Server error while paying bill' });
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
