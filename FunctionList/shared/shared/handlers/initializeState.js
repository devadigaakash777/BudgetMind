import { smartBudget } from '../services/smartBudget.js';
import { deepClone } from '../utils/deepClone.js';
import {  getDaysUntilDate } from '../utils/convertToDate.js';


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
    const isSalaryDay = today === state.User.salary.date;
    const isSteadyDay = today === state.SteadyWallet.date;

    // If today is not salary day or steady day, do nothing
    try{
      // if (!(isSalaryDay || isSteadyDay)) {
        const salaryDay = state.User.hasSalary ? state.User.salary.date : state.SteadyWallet.date;
        // const salaryDate = getNextSalaryDateISO(salaryDay);
        const daysLeft = getDaysUntilDate(salaryDay);
        const result = smartBudget(state ,remaining, daysLeft);
        state.MonthlyBudget.amount = result.monthlyBudget;
        state.MonthlyBudget.amountFunded = result.monthlyBudget;
        state.TemporaryWallet.balance = result.remaining;
      // }   
    }
    catch(error){
      state.User.isProfileComplete = false;
      throw error;
    }

  } else {
    state.User.isProfileComplete = false;
    throw new Error("threshold should less than total wealth");
  }
  const salary = state.User.salary.amount;
  const getDaysInMonth = () => new Date(
                                new Date().getFullYear(),
                                new Date().getMonth() + 1,
                                0
                                ).getDate();
                      
  const maxAllowed = Math.floor(salary / getDaysInMonth());

  state.DailyBudget.min = maxAllowed;
  state.DailyBudget.max = maxAllowed;

  state.User.isProfileComplete = true;
  console.log("[initializeState] returning state:", state);
  return state;
}
