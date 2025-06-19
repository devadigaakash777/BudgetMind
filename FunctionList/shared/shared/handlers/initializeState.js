import { deepClone } from '../utils/deepClone.js';

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

    state.TemporaryWallet.balance = remaining;
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
