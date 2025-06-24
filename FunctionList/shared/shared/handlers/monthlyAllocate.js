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

  const today = currentDate.getDate();

  // Safely check if today matches salary day (only if user has salary enabled)
  const hasSalaryEnabled = state.User?.hasSalary === true;
  const salaryDay = hasSalaryEnabled && state.User.Salary?.date;
  const isSalaryDay = hasSalaryEnabled && today === salaryDay;

  // Always safe to check steady wallet day
  const steadyWalletDay = state.SteadyWallet?.date;
  const isSteadyDay = today === steadyWalletDay;

  // If today is a salary day or steady wallet day, process funds
  const shouldAllocate = isSalaryDay || isSteadyDay;
  const updatedState = shouldAllocate
    ? processSalary(state, salary, currentDate, userDailyBudget)
    : state; // no allocation today — return state unchanged

  console.log("[monthlyAllocate] returning:", updatedState);
  return updatedState;
}
