import { getDaysRemaining } from '../utils/dateUtils.js';
import { addToTemporaryWallet } from './deductTemporaryWallet.js';
import { smartBudget } from './smartBudget.js';

/**
 * Consumes amount from the monthly budget based on remaining days in the month.
 * If requiredAmount is provided, tries to deduct it from the monthly budget.
 * Any leftover daily budget is added to TemporaryWallet. Smart budget is applied.
 *
 * @param {object} state - The application state object.
 * @param {number|null} requiredAmount - Amount to consume, or null to recalculate only.
 * @param {string|null} dateStr - Optional target date in ISO format (e.g., "2025-06-30").
 * @return {number} - Amount get from the Monthly budget
 */
export function consumeFromMonthlyBudget(state, requiredAmount = null, dateStr = null) {
  const today = new Date();
  const daysLeft = getDaysRemaining(dateStr);
  console.debug('[consumeFromMonthlyBudget] daysLeft:', daysLeft);
  const dailyMin = state.DailyBudget.min;
  const dailyActual = state.DailyBudget.amount;

  const calculatedMonthlyBudget = dailyMin * daysLeft;

  let usableBudget = state.MonthlyBudget.amount;

  // Case: If no requiredAmount, update MonthlyBudget to calculated
  if (requiredAmount === null) {
    usableBudget = calculatedMonthlyBudget;
  } else {
    if (requiredAmount <= usableBudget) {
      usableBudget -= requiredAmount;
    } else {
      throw new Error("consumeFromMonthlyBudget: Requested amount exceeds budget.");
    }
  }

  // Apply updates

  const expectedDailyTotal = dailyActual * daysLeft;
  const extraAmount = expectedDailyTotal - usableBudget;

  console.debug('[consumeFromMonthlyBudget] usableBudget:', usableBudget);
  console.debug('[consumeFromMonthlyBudget] extraAmount:', extraAmount);

  const result = smartBudget(state, usableBudget, daysLeft);

  state.MonthlyBudget.amount = result.monthlyBudget;

  const smartDailyBudget =  result.monthlyBudget / daysLeft;
  const totalRemaining = extraAmount + result.remaining;

  // state.TemporaryWallet.balance += result.remaining;

  console.debug('[consumeFromMonthlyBudget] Result From smart budget: ', result);
  console.debug('[consumeFromMonthlyBudget] TemporaryWallet:', extraAmount);
  // if (extraAmount > 0) {
  //   addToTemporaryWallet(state, extraAmount);
  // }

  return {totalRemaining, smartDailyBudget};
}
