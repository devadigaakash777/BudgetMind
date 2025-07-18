import { deepClone } from '../utils/deepClone.js';
import { handleFixedExpenseItems, deductFixedExpenses } from './fixedExpenses.js';
import { deductTemporaryWallet } from './deductTemporaryWallet.js';
import { smartBudget } from './smartBudget.js';
import { fundWishlistItems } from './fundWishlist.js';
import { addDailyBufferToTemporaryWallet } from './dailyBufferService.js';

/**
 * Processes the user's salary or steady wallet for the month, and performs full monthly fund allocation.
 * 
 * Steps:
 * 1. Handles expired fixed expenses
 * 2. Adds DailyBuffer to TemporaryWallet
 * 3.Deduct amount from Temporary Wallet
 * 4. Calculates and funds the Monthly Budget (DailyBudget)
 * 5. Deducts fixed expenses
 * 6. Allocates any leftover salary to Wishlist items
 * 
 * Why needed:
 * This is the core monthly budgeting process — ensures all wallets and budgets are balanced each salary cycle.
 * 
 * @param {object} state - Current state of all wallets, budgets, wishlist, expenses, etc.
 * @param {number|null} salary - The salary amount to process. If null, pulls from steady wallet.
 * @param {Date} currentDate - Today's date object (needed to check if it is salary day)
 * @param {number|null} userDailyBudget - Optional user override for DailyBudget (per day)
 * @returns {object} Updated state after monthly processing
 */
export function processSalary(state, salary, currentDate, userDailyBudget = null) {
  console.log("[processSalary] called with:", { salary, currentDate, userDailyBudget });

  const newState = deepClone(state);

  // const today = currentDate.getDate();
  // const isSalaryDay = today === state.User.Salary.date;
  // const isSteadyDay = today === state.SteadyWallet.date;

  // 1. Handle any expired fixed expenses first
  handleFixedExpenseItems(newState);

  // // If today is not salary day or steady day, do nothing
  // if (!(isSalaryDay || isSteadyDay)) {
  //   console.log("[processSalary] not a salary/steady day, returning unchanged state");
  //   return newState;
  // }

  // Determine actual salary to use
  if (!state.User.hasSalary) {
    // User relies on SteadyWallet instead of salary
    if (state.SteadyWallet.month <= 0) {
      const topUp = state.SteadyWallet.monthlyAmount;
      const extended = extendSteadyWalletMonth(newState, topUp);
      if (!extended) {
        console.warn("[processSalary] Could not extend SteadyWallet — skipping process");
        return newState;
      }
    }

    salary = state.SteadyWallet.monthlyAmount;

    // Deduct month and balance only if enough balance exists
    console.log("[processSalary] SteadyWallet balance = "+newState.SteadyWallet.balance+"and Salary= "+salary );
    if (newState.SteadyWallet.balance >= salary) {
      newState.SteadyWallet.month--;
      newState.SteadyWallet.balance -= salary;
    } else {
      console.warn("[processSalary] Not enough SteadyWallet balance to process salary.");
      return newState;
    }
  }

  // newState.User.Salary.amount = salary;
  let remaining = salary;

  // 2. Move DailyBuffer funds and remaining Monthly budget fund to TemporaryWallet
  newState.TemporaryWallet.balance += newState.MonthlyBudget.amount;
  newState.MonthlyBudget.amount = 0;
  addDailyBufferToTemporaryWallet(newState);

  // 3.Deduct amount from Temporary Wallet
  deductTemporaryWallet(newState);


  // 4. Process DailyBudget
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  let monthlyBudget = 0;

  if (userDailyBudget !== null) {
    console.debug("[DailyBudget] Input userDailyBudget:", userDailyBudget);

    // Clamp userDailyBudget within allowed min/max
    userDailyBudget = Math.max(state.DailyBudget.min, Math.min(userDailyBudget, state.DailyBudget.max));
    monthlyBudget = parseFloat((userDailyBudget * daysInMonth).toFixed(2));

    console.debug("[DailyBudget] Clamped userDailyBudget:", userDailyBudget);
    console.debug("[DailyBudget] Calculated monthlyBudget:", monthlyBudget);
    console.debug("[DailyBudget] Remaining after fixed expenses:", remaining);

    if (Number(remaining.toFixed(2)) < monthlyBudget) {
      const tempWallet = newState.TemporaryWallet;
      let shortage = monthlyBudget - remaining;
      remaining = 0;
      console.debug("[DailyBudget] Shortage:", shortage);
      console.debug("[DailyBudget] TempWallet balance:", tempWallet.balance);

      if (tempWallet.balance >= shortage) {
        // Cover shortage from TemporaryWallet
        tempWallet.balance -= shortage;
        newState.DailyBudget.amount = userDailyBudget;
        console.debug("[DailyBudget] Covered shortage from tempWallet");
      } else {
        // Not enough in TemporaryWallet — fallback to smartBudget calculation
        const totalAvailable = tempWallet.balance + remaining;
        tempWallet.balance = 0;
        const budget = smartBudget(newState, totalAvailable, daysInMonth);
        monthlyBudget = budget.monthlyBudget;
        remaining = budget.remaining;
        console.debug("[DailyBudget] Used smartBudget() — New monthlyBudget:", monthlyBudget);
        console.debug("[DailyBudget] Adjusted tempWallet balance:", tempWallet.balance);
      }
    } else {
      // No shortage — use requested userDailyBudget directly
      newState.DailyBudget.amount = userDailyBudget;
      remaining = Math.max(0, remaining - monthlyBudget);
      console.debug("[DailyBudget] No shortage — DailyBudget set directly.");
    }
    console.debug("[DailyBudget] Final remaining after budget:", remaining);
  }

  // 5. Deduct fixed expenses 
  remaining = deductFixedExpenses(newState, remaining);

  // 6. Allocate leftover funds to Wishlist items
  remaining = fundWishlistItems(newState, remaining);

  // If no userDailyBudget provided, fallback to smartBudget calculation
  if (userDailyBudget === null) {
    const budget = smartBudget(newState, remaining, daysInMonth);
    remaining = budget.remaining;
    monthlyBudget = budget.monthlyBudget;
    console.debug("monthlyBudget: ",monthlyBudget);
    // remaining = 0;
  }

  newState.TemporaryWallet.balance += remaining;
  console.log("[processSalary] final temp wallet cost:", newState.TemporaryWallet.balance);
  // Finalize MonthlyBudget fields
  newState.MonthlyBudget.amount = monthlyBudget;
  newState.MonthlyBudget.amountFunded = monthlyBudget;

  // At end of process — decrement duration on one-time (non-permanent) fixed expenses
  let totalExpenseSavedAmount = 0;
  newState.FixedExpenses.expenses.forEach(expense => {
    if (!expense.isPermanent) {
      expense.durationInMonths = Math.max(0, expense.durationInMonths - 1);
    }
    totalExpenseSavedAmount += (expense.amount - expense.amountToFund);
  });
  newState.FixedExpenses.totalSavedAmount = totalExpenseSavedAmount;

  // wishlist item final update
  let totalItemsSavedAmount = 0;
  newState.Wishlist.items.forEach(item => {
    if (item.priority > 0 && item.monthLeft > 0 && item.isFunded) {
      item.monthLeft = Math.max(0, item.monthLeft - 1);
      if(item.savedAmount != item.cost){
          item.isFunded = false;
      }
    }
    console.log("[processSalary] returning updated state:", newState);
    totalItemsSavedAmount += item.savedAmount;
  });
  newState.Wishlist.totalSavedAmount = totalItemsSavedAmount;

  console.log("[processSalary] returning updated state:", newState);
  return newState;
}

/**
 * Attempts to extend SteadyWallet month using funds from TemporaryWallet or MainWallet.
 * 
 * Why needed:
 * Allows users without salary to "buy" more months of their steady budget — fallback mechanism for when salary is missing.
 * 
 * @param {object} state - Current state of user wallets
 * @param {number} topUp - Amount needed to extend 1 month
 * @returns {boolean} True if extension was successful, false otherwise
 */
export function extendSteadyWalletMonth(state, topUp) {
  console.log("[extendSteadyWalletMonth] called with:", { topUp });

  if (state.TemporaryWallet.balance >= topUp) {
    state.TemporaryWallet.balance -= topUp;
    state.SteadyWallet.balance = topUp;
    state.SteadyWallet.month++;
    console.warn("[extendSteadyWalletMonth] Extended month using TemporaryWallet");
    return true;
  }

  if (state.MainWallet.balance >= topUp) {
    state.MainWallet.balance -= topUp;
    state.SteadyWallet.balance = topUp;
    state.SteadyWallet.month++;
    console.warn("[extendSteadyWalletMonth] Extended month using MainWallet");
    return true;
  }

  console.warn("[extendSteadyWalletMonth] Failed — insufficient funds");
  return false;
}
