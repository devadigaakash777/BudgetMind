import { normalizeExpense } from '../utils/normalizeExpense.js';
import { getAmountComparison } from '../utils/getAmountComparison.js';
import { splitAmountByDays } from '../utils/splitAmountByDays.js'

/**
 * Log extended expenses over a number of days.
 * Distributes expense across the given duration and adjusts overage using buffer, temp wallet, or monthly budget.
 * 
 * @param {object} state - Current application state
 * @param {{ amount: number, duration?: number }} expense - Expense object with amount and duration in days
 * @param {Date} currentDate - Date the expense starts
 * @returns {object} Updated state object
 */
export function logExtendedExpense(state, expense, currentDate, userId, details) {
  const newState = structuredClone(state);
  const dailyBudget = newState.DailyBudget.amount;

  const duration = (typeof expense.duration === 'number' && expense.duration > 0) ? expense.duration : 1;
  // const normalizedTotal = normalizeExpense(expense, currentDate);
  const expectedCost = normalizeExpense(expense, currentDate);
  const perDayCost = splitAmountByDays(expectedCost, expense.amount, duration);
  let perDay = perDayCost.dailyAmount;

  console.debug("[logExtendedExpense] Normalized total:", expense);
  console.debug("[logExtendedExpense] Per day amount:", perDay);
  console.debug("[logExtendedExpense] Duration:", duration);

  newState.UserDailyExpenses = newState.UserDailyExpenses || [];

  const dailyExpense = newState.DailyBudget.amount;

  // const userId = newState.User.id;
  let balance = newState.MonthlyBudget.amount;

  const data = [];
  for (let i = 0; i < duration; i++) {
    if(duration === (i+1)){
      perDay = perDay + perDayCost.leftoverAmount;
    }
    const date = new Date(currentDate);
    const limitStatus = getAmountComparison(dailyExpense, perDay); 
    balance -= perDay;
    date.setDate(date.getDate() - i);
    data.push({
      userId: userId,
      amount: perDay,
      date: date.toISOString().split('T')[0],
      details: details,
      balance: balance,
      amountStatus: limitStatus.amountStatus,
      amountDifference: limitStatus.amountDifference,
    });
  }

  const dailyTotal = dailyBudget * duration;

  newState.MonthlyBudget.amount = Math.max(0, newState.MonthlyBudget.amount - dailyTotal);
  console.debug("[logExtendedExpense] Final monthly Budget Amount :", newState.MonthlyBudget.amount);

  let overage = Math.max(expense.amount - dailyTotal, 0);
  const buffer = newState.DailyBuffer.balance;

  console.debug("[logExtendedExpense] Daily Total :", dailyTotal);
  console.debug("[logExtendedExpense] overage :", overage);

  if (overage > 0) {
    if (overage <= buffer) {
      newState.DailyBuffer.balance -= overage;
      overage = 0;
    } else {
      overage -= buffer;
      newState.DailyBuffer.balance = 0;
      const tempWallet = newState.TemporaryWallet.balance; 
      if (overage <= tempWallet) {
        newState.TemporaryWallet.balance -= overage;
        overage = 0;
      } else {
        console.debug("[logExtendedExpense] overage before took from temp wallet:", overage, tempWallet);
        overage -= tempWallet;
        newState.TemporaryWallet.balance = 0;
        console.debug("[logExtendedExpense] overage after took from temp wallet:", overage);
      }
    }
  }

  newState.DailyBuffer.balance += Math.max(dailyTotal - expense.amount, 0);
  console.debug("[logExtendedExpense] Final state:", newState);
  return {newState, overage, data};
}
