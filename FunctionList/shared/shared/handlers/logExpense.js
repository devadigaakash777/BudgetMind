import { normalizeExpense } from '../utils/normalizeExpense.js';
import { consumeFromMonthlyBudget } from '../services/consumeFromMonthlyBudget.js';
import { getNextSalaryDateISO } from '../utils/convertToDate.js';
import { getAmountComparison } from '../utils/getAmountComparison.js';

/**
 * Log extended expenses over a number of days.
 * Distributes expense across the given duration and adjusts overage using buffer, temp wallet, or monthly budget.
 * 
 * @param {object} state - Current application state
 * @param {{ amount: number, duration?: number }} expense - Expense object with amount and duration in days
 * @param {Date} currentDate - Date the expense starts
 * @returns {object} Updated state object
 */
export function logExtendedExpense(state, expense, currentDate) {
  const newState = structuredClone(state);
  const dailyBudget = newState.DailyBudget.amount;

  const duration = (typeof expense.duration === 'number' && expense.duration > 0) ? expense.duration : 1;
  // const normalizedTotal = normalizeExpense(expense, currentDate);
  const perDay = normalizeExpense(expense, currentDate);

  console.debug("[logExtendedExpense] Normalized total:", expense);
  console.debug("[logExtendedExpense] Per day amount:", perDay);
  console.debug("[logExtendedExpense] Duration:", duration);

  newState.UserDailyExpenses = newState.UserDailyExpenses || [];

  const dailyExpense = newState.DailyBudget.amount;

  const userId = newState.User.id;

  for (let i = 0; i < duration; i++) {
    const date = new Date(currentDate);
    const limitStatus = getAmountComparison(dailyExpense, perDay); 
    date.setDate(date.getDate() + i);
    newState.UserDailyExpenses.push({
      id: crypto.randomUUID(),
      userId : userId,
      amount: perDay,
      amountStatus: limitStatus.amountStatus,
      amountDifference: limitStatus.amountDifference,
      date: date.toISOString().split('T')[0]
    });
  }

  const dailyTotal = dailyBudget * duration;

  newState.MonthlyBudget.amount = Math.max(0, newState.MonthlyBudget.amount - dailyTotal);

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
        const salaryDay = state.User.hasSalary ? state.Salary.date : state.SteadyWallet.date;
        const salaryDate = getNextSalaryDateISO(salaryDay);
        console.debug(salaryDate);
        try{
          consumeFromMonthlyBudget(newState, overage, salaryDate);
          newState.TemporaryWallet.balance -= overage;
          overage = 0;
        }
        catch (err){
          consumeFromMonthlyBudget(newState, null, salaryDate);
          return {newState, overage};
          console.warn("cant satisfy the request go with handleTemporaryWallet"); 
        }
      }
    }
  }

  console.debug("[logExtendedExpense] Final state:", newState);
  return {newState, overage};
}
