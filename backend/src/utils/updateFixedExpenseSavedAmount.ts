import { FixedExpense } from '../models/budget.model.js';
import { BudgetSummary } from '../models/budget.model.js';

export const updateFixedExpenseSavedAmount = async (userId: string) => {
  const expenses = await FixedExpense.find({ userId });

  // Calculate total funded amount (only for funded expenses)
  const totalFunded = expenses.reduce((sum, expense) => {
    if (expense.isFunded && !expense.isPaid) return sum + (expense.amount - expense.amountToFund);
    return sum;
  }, 0);

  await BudgetSummary.findOneAndUpdate(
    { userId },
    {
      $set: {
        'FixedExpenses.totalSavedAmount': totalFunded
      }
    },
    { upsert: true }
  );
};
