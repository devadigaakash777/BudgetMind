import { getDaysRemaining } from '../utils/dateUtils.js';
import { smartBudget } from './smartBudget.js';

/**
 * Consumes amount from the monthly budget based on remaining days.
 * If requiredAmount is provided, deducts it from the monthly budget.
 * Recalculates smart budget and updates DailyBudget and MonthlyBudget.
 *
 * @param {object} state - The application state object (mutated).
 * @param {number|null} requiredAmount - Amount to consume, or null to recalculate only.
 * @param {string|null} dateStr - Optional ISO date string (e.g., "2025-06-30").
 * @returns {object} - Contains { totalRemaining, smartDailyBudget }
 */
export function consumeFromMonthlyBudget(state, unpaidDuration, requiredAmount = null, dateStr = null) {
  const daysLeft = getDaysRemaining(dateStr) + unpaidDuration;
  console.debug('[consumeFromMonthlyBudget] Days remaining:', daysLeft);

  if (daysLeft <= 0) {
    throw new Error("Invalid days remaining. Date may be past salary reset.");
  }

  const dailyMin = state.DailyBudget.min;
  const dailyActual = state.DailyBudget.amount;
  const calculatedMonthlyBudget = dailyMin * daysLeft;

  let availableBudget = state.MonthlyBudget.amount;

  // Deduct requiredAmount if provided
  if (requiredAmount !== null) {
    if (requiredAmount > availableBudget) {
      throw new Error("Requested amount exceeds monthly budget.");
    }
    availableBudget -= requiredAmount;
  } else {
    availableBudget = calculatedMonthlyBudget;
  }

  // Smart budgeting
  const expectedTotal = dailyActual * daysLeft;
  const extraBeforeSmart = expectedTotal - availableBudget;

  const { monthlyBudget, remaining } = smartBudget(state, availableBudget, daysLeft);
  const smartDailyBudget = monthlyBudget / daysLeft;

  state.MonthlyBudget.amount = monthlyBudget;

  const totalRemaining = extraBeforeSmart + remaining;

  console.debug('[consumeFromMonthlyBudget] Usable Budget:', availableBudget);
  console.debug('[consumeFromMonthlyBudget] Result from smartBudget:', {
    monthlyBudget,
    remaining,
    smartDailyBudget,
    totalRemaining
  });

  return { totalRemaining, smartDailyBudget };
}
