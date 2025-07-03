import { splitAmountByDays } from '../utils/splitAmountByDays.js';

/**
 * Calculates the ideal smart daily budget and updates state
 * @param {object} state - The current working state
 * @param {number} remaining - The remaining amount after deductions
 * @param {number} daysInMonth - Number of days in current month
 * @returns {number} - Monthly budget value based on smart budgeting
 */
export function smartBudget(state, remaining, daysInMonth) {
  console.log("[smartBudget] called with:", { remaining, daysInMonth });

  const dayBudget = splitAmountByDays(state.DailyBudget.max, remaining, daysInMonth);
  // state.TemporaryWallet.balance += dayBudget.leftoverAmount;
  let ideal = dayBudget.dailyAmount;
  ideal = Math.max(state.DailyBudget.min, Math.min(ideal, state.DailyBudget.max));
  const monthlyBudget = parseFloat((ideal * daysInMonth).toFixed(2));

  if (monthlyBudget > remaining) {
    throw new Error("Not enough funds for minimum daily budget.");
  }
  remaining = dayBudget.leftoverAmount;
  state.DailyBudget.amount = ideal;
  console.debug("[smartBudget] remaining:", remaining);
  console.debug("[smartBudget] returning:", monthlyBudget);

  return { monthlyBudget, remaining };
}