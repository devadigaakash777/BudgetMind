import { processSalary } from '../services/processSalary.js';

/**
 * Monthly Salary or Steady Wallet Allocator
 *
 * This function allocates new salary or steady funds on their respective due dates.
 * It ensures that funds are processed only on the correct day of the month.
 *
 * Why this function is needed:
 * - Centralizes monthly fund allocation logic for both salaried and steady fund users.
 * - Ensures consistent salary/steady-wallet processing across the app.
 * - Prevents accidental re-processing of salary/funds on incorrect dates.
 *
 * @param {object} state - Current full user state (immutable pattern assumed)
 * @param {Date} currentDate - Current date (typically system date)
 * @param {number|null} salary - Optional salary amount override (used when processing salary manually)
 * @param {number|null} userDailyBudget - Optional override for new daily budget
 * @returns {object} Updated state after possible fund allocation (or unchanged state if no allocation occurs)
 */
export function monthlyAllocate(state, currentDate, salary = null, userDailyBudget = null) {
  console.log("[monthlyAllocate] called with:", { state, currentDate, salary, userDailyBudget });

  let updatedState 
  try{
    updatedState = processSalary(state, salary, currentDate, userDailyBudget)
  }
  catch{
    state.DailyBudget.min = 0;
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    state.DailyBudget.max = Math.floor(salary / daysInMonth);
    updatedState = processSalary(state, salary, currentDate, userDailyBudget)
  }
  console.log("[monthlyAllocate] returning:", updatedState);
  return updatedState;
}
