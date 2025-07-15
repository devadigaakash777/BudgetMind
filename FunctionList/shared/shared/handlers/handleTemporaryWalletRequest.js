import { deepClone } from '../utils/deepClone.js';
import { consumeFromMainPath } from '../services/fixedExpenses.js';
import { consumeFromSavingWishlist } from '../services/fixedExpenses.js';
import { consumeFromMonthlyBudget } from '../services/consumeFromMonthlyBudget.js';
import { getNextSalaryDateISO } from '../utils/convertToDate.js';

/**
 * Handles requests from TemporaryWallet with fallback to main or saving.
 * @param {object} state - Current state.
 * @param {number} amountRequested - Requested amount.
 * @param {string} sourcePreference - 'main' or 'wishlist'.
 * @param {boolean} canDecreaseBudget - Can decrease budget or not 
 * @param {boolean} hasBudgetPaid - Can decrease budget or not 
 * @returns {object} - Updated state, amount collected, and sources used.
 */
export function handleTemporaryWalletRequest(state, amountRequested, sourcePreference, canDecreaseBudget, hasBudgetPaid) {
  console.debug('handleTemporaryWalletRequest called with:', amountRequested, sourcePreference);
  const newState = deepClone(state);
  const collected = { amountCollected: 0, freedBudget: 0, sources: [] };
  
  if(canDecreaseBudget && sourcePreference === 'main'){
        let salaryDay = newState.User.hasSalary ? newState.User.salary.date : newState.steadyWallet.date;
        if(hasBudgetPaid){
          salaryDay -= 1;
        }
        const salaryDate = getNextSalaryDateISO(salaryDay);
        let extraAmount = 0;
        console.debug(salaryDate);
        try{
          extraAmount = consumeFromMonthlyBudget(newState, amountRequested, salaryDate);
        }
        catch (err){
          extraAmount = consumeFromMonthlyBudget(newState, null, salaryDate);
          console.warn("cant satisfy the request go with handleTemporaryWallet"); 
        }
        if(hasBudgetPaid){
          amountRequested -= extraAmount.totalRemaining;
          collected.amountCollected += extraAmount.totalRemaining;
        }else{
          const releasedAmount = state.DailyBudget.amount - extraAmount.smartDailyBudget;
          collected.amountCollected += extraAmount.totalRemaining;
          collected.freedBudget = releasedAmount;
          amountRequested -= (extraAmount.totalRemaining - releasedAmount);
        }
  }

  const shortfall = amountRequested;
  console.debug("[handleTemporaryWalletRequest] shortfall ",shortfall);
  if (shortfall > 0) {
    let result = { amount: 0, sources: [] };

    if (sourcePreference === 'main') {
      if (!newState.MainWallet.isSelected) {
        result = consumeFromMainPath(newState, shortfall);
      }else{
        console.warn("Can't request money for MainWallet by MainWallet");
      }
    } 
    else {
      result = consumeFromSavingWishlist(newState, shortfall);
    }

    if (result.amount > 0 && Array.isArray(result.sources)) {
      collected.amountCollected += result.amount;
      collected.sources = collected.sources.concat(result.sources);
    }
  }

  newState.TemporaryWallet.balance += collected.amountCollected;
  console.debug('handleTemporaryWalletRequest returned:', collected);
  return { newState, ...collected };
}

/**
 * Collect amount using temporary wallet with fallbacks.
 * @param {object} state - User's full wallet state.
 * @param {number} amountRequested - Total amount to collect.
 * @param {'main' | 'wishlist'} preference - First source to try.
 * @param {boolean} canDecreaseBudget - Whether daily budget can be adjusted.
 * @param {boolean} hasBudgetPaid - Whether today’s daily budget was already paid.
 * @returns {object} - Updated state with money collected or original state if failed.
 */
export function collectAmount(
  state,
  amountRequested,
  preference = 'main',
  canDecreaseBudget = false,
  hasBudgetPaid = false
) {
  const originalState = deepClone(state);
  let required = amountRequested;
  let sourcePref = preference;
  let currentState = deepClone(state);

  for (let i = 0; i < 2; i++) {
    if (required <= 0) break;

    const result = handleTemporaryWalletRequest(
      currentState,
      required,
      sourcePref,
      canDecreaseBudget,
      hasBudgetPaid
    );

    currentState = result.newState;
    const collectedThisRound = result.amountCollected;

    required -= collectedThisRound;
    sourcePref = sourcePref === 'main' ? 'wishlist' : 'main';

    console.debug(`[collectAmount] After round ${i + 1}, required:`, required);
  }

  if (required > 0) {
    console.warn('[collectAmount] Insufficient balance. Returning original state.');
    return originalState;
  }

  return currentState;
}
