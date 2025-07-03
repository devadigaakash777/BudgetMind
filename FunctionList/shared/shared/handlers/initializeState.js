import { smartBudget } from '../services/smartBudget.js';
import { deepClone } from '../utils/deepClone.js';
import { getDaysRemaining } from '../utils/dateUtils.js';
import { getNextSalaryDateISO } from '../utils/convertToDate.js';


/**
 * Initialize the system with total wealth and threshold
 * @param {object} initialState
 * @param {number} totalWealth
 * @param {number} threshold
 * @returns {object|null} new state or null if not feasible
 */
export function initializeState(initialState, totalWealth, threshold) {
  console.log("[initializeState] called with:", { totalWealth, threshold });

  const state = deepClone(initialState);
  state.TotalWealth.amount = totalWealth;
  state.threshold = threshold;

  let remaining = totalWealth;

  // Always reset balances to avoid leftovers from initialState
  state.MainWallet.balance = 0;
  state.TemporaryWallet.balance = 0;
  state.SteadyWallet.balance = 0;

  if (totalWealth >= threshold) {
    state.MainWallet.balance = threshold;
    remaining -= threshold;

    if (!state.User.hasSalary) {
      const required = state.SteadyWallet.monthlyAmount * state.SteadyWallet.month;
      if (required > remaining) {
        console.warn("Insufficient funds to cover SteadyWallet monthly allocation.");
        return null;
      } else {
        state.SteadyWallet.balance = required;
        remaining -= required;
      }
    }

    // check whether today is salary day if not add budget till next salary day
    const today = new Date().getDate();
    const isSalaryDay = today === state.User.Salary.date;
    const isSteadyDay = today === state.SteadyWallet.date;

    // If today is not salary day or steady day, do nothing
    if (!(isSalaryDay || isSteadyDay)) {
      const salaryDay = state.User.hasSalary ? state.User.Salary.date : state.SteadyWallet.date;
      const salaryDate = getNextSalaryDateISO(salaryDay);
      const daysLeft = getDaysRemaining(salaryDate);
      const result = smartBudget(state ,remaining, daysLeft);
      state.TemporaryWallet.balance = result.remaining;
    }   

  } else {
    if (!state.User.hasSalary) {
      console.warn("Insufficient wealth and no salary. Cannot initialize.");
      return null;
    }
    state.MainWallet.balance = totalWealth;
    // explicitly reset TemporaryWallet
    state.TemporaryWallet.balance = 0;
    // explicitly reset SteadyWallet
    state.SteadyWallet.balance = 0;
  }

  console.log("[initializeState] returning state:", state);
  return state;
}
