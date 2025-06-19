// ========================
// STATE REPRESENTATION
// ========================
const initialState = {
  User: { hasSalary: false },
  MainWallet: { balance: 0 },
  TemporaryWallet: { balance: 0 },
  SteadyWallet: { balance: 0, month: 4, date: 1, monthlyAmount: 4000 },
  Wishlist: { items: [] },
  DailyBuffer: { balance: 0 },
  FixedExpenses: { expenses: [] },
  MonthlyBudget: { amount: 0 },
  DailyBudget: { amount: 0, min: 0, max: 0 },
  TotalWealth: { amount: 0 },
  Salary: { amount: 0, date: 1 }, // date: day of month (1-31)
  PendingPayments: { amount: 0 },
  threshold: 0 // User-defined threshold for MainWallet
};
// const initialState = {
//   User: { hasSalary: true },
//   MainWallet: { balance: 50000, isSelected: false },
//   TemporaryWallet: { balance: 50000 },
//   SteadyWallet: { balance: 0, month: 12, date: 1, monthlyAmount: 5000, isSelected: false },
//   Wishlist: {
//     items: [
//       { id: 'A', savedAmount: 5000, priority: 3, cost: 10000, monthsToBuy: 5, isFunded: false, isSelected: false },
//       { id: 'B', savedAmount: 1500, priority: 1, cost: 3000, monthsToBuy: 3, isFunded: false, isSelected: true}
//     ]
//   },
//   DailyBuffer: { balance: 0, isSelected: false },
//   FixedExpenses: {
//     expenses: [
//       { id: 1, isPaid: false, amount: 1500, isPermanent: true, isFunded: true, durationInMonths: 3, amountToFund: 0, isSelected: true },
//       { id: 2, isPaid: true, amount: 2000, isPermanent: true, isFunded: true, durationInMonths: 1, amountToFund: 2000, isSelected: false },
//       { id: 3, isPaid: false, amount: 800, isPermanent: true, isFunded: true, durationInMonths: 2, amountToFund: 300, isSelected: false }
//     ]
//   },
//   MonthlyBudget: { amount: 0 },
//   DailyBudget: { amount: 0, min: 100, max: 500 }, // added min and max
//   TotalWealth: { amount: 100000 },
//   Salary: { amount: 0, date: 1 }, // today is salary day
//   PendingPayments: { amount: 0 },
//   threshold: 50000
// };


// ========================
// CORE FUNCTIONS
// ========================

/**
 * Initialize the system with total wealth and threshold
 * @param {number} totalWealth
 * @param {number} threshold
 * @returns {object|null} new state or null if not feasible
 */
function initializeState(totalWealth, threshold) {
  console.log("[initializeState] called with:", { totalWealth, threshold });

  const state = deepClone(initialState);
  state.TotalWealth.amount = totalWealth;
  state.threshold = threshold;

  let remaining = totalWealth;

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
  }

  console.log("[initializeState] returning state:", state);
  return state;
}

/**
 * Allocate salary or steady funds monthly
 * @param {object} state - Current user state
 * @param {Date} currentDate - Date of allocation
 * @param {number|null} salary - Optional salary amount if salaried
 * @param {number|null} userDailyBudget - Optional daily budget
 * @returns {object} Updated state
 */
function monthlyAllocate(state, currentDate, salary = null, userDailyBudget = null) {
  console.log("[monthlyAllocate] called with:", { state, currentDate, salary, userDailyBudget });

  const today = currentDate.getDate();
  const isSalaryDay = today === state.Salary.date;
  const isSteadyDay = today === state.SteadyWallet.date;

  const result = (isSalaryDay || isSteadyDay)
    ? processSalary(state, salary, currentDate, userDailyBudget)
    : state;

  console.log("[monthlyAllocate] returning:", result);
  return result;
}

/**
 * Extend SteadyWallet month using available wallets
 * @param {object} state - The user state
 * @param {number} topUp - Required amount to extend one month
 * @returns {boolean} True if extension was successful
 */
function extendSteadyWalletMonth(state, topUp) {
  console.log("[extendSteadyWalletMonth] called with:", { topUp });

  if (state.TemporaryWallet.balance >= topUp) {
    state.TemporaryWallet.balance -= topUp;
    state.SteadyWallet.month++;
    console.warn("SteadyWallet month extended using TemporaryWallet.");
    console.log("[extendSteadyWalletMonth] success: true");
    return true;
  } else if (state.MainWallet.balance >= topUp) {
    state.MainWallet.balance -= topUp;
    state.SteadyWallet.month++;
    console.warn("SteadyWallet month extended using MainWallet.");
    console.log("[extendSteadyWalletMonth] success: true");
    return true;
  } else {
    console.warn("Unable to extend SteadyWallet: Not enough funds in Temporary or Main wallet.");
    console.log("[extendSteadyWalletMonth] success: false");
    return false;
  }
}

/**
 * Handle salary/steady fund allocation and budgeting
 * @param {object} state - Current state
 * @param {number|null} salary - If null and no salary, use steady amount
 * @param {Date} currentDate - Today's date
 * @param {number|null} userDailyBudget - Optional user preference
 * @returns {object} Updated state
 */
function processSalary(state, salary, currentDate, userDailyBudget = null) {
  console.log("[processSalary] called with:", { salary, currentDate, userDailyBudget });

  const newState = deepClone(state);
  const today = currentDate.getDate();
  const isSalaryDay = today === state.Salary.date;
  const isSteadyDay = today === state.SteadyWallet.date;

  handleFixedExpenseItems(newState);     // Delete and Handle all the expired items

  if (!(isSalaryDay || isSteadyDay)) {
    console.log("[processSalary] not a salary/steady day, returning unchanged state");
    return newState;
  }

  if (!state.User.hasSalary) {
    if (state.SteadyWallet.month <= 0) {
      const topUp = state.SteadyWallet.monthlyAmount;
      const extended = extendSteadyWalletMonth(newState, topUp);
      if (!extended) return newState;
    }
    salary = state.SteadyWallet.monthlyAmount;
    newState.SteadyWallet.month--;
    newState.SteadyWallet.balance -= salary;
  }

  newState.Salary.amount = salary;
  let remaining = salary;

  deductTemporaryWallet(newState);
  remaining = deductFixedExpenses(newState, remaining);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  let monthlyBudget = 0;

  if (userDailyBudget !== null) {
  console.debug("[DailyBudget] Input userDailyBudget:", userDailyBudget);

  userDailyBudget = Math.max(state.DailyBudget.min, Math.min(userDailyBudget, state.DailyBudget.max));
  monthlyBudget = parseFloat((userDailyBudget * daysInMonth).toFixed(2));
  console.debug("[DailyBudget] Clamped userDailyBudget:", userDailyBudget);
  console.debug("[DailyBudget] Calculated monthlyBudget:", monthlyBudget);
  console.debug("[DailyBudget] Current remaining:", remaining);

  if (Number(remaining.toFixed(2)) < monthlyBudget) {
    const tempWallet = newState.TemporaryWallet;
    let shortage = monthlyBudget - remaining;

    console.debug("[DailyBudget] Shortage:", shortage);
    console.debug("[DailyBudget] TempWallet balance:", tempWallet.balance);

    if (tempWallet.balance >= shortage) {
      tempWallet.balance -= shortage;
      newState.DailyBudget.amount = userDailyBudget;
      console.debug("[DailyBudget] Covered shortage from tempWallet");
    } 
    else {
      const totalAvailable = tempWallet.balance + remaining;
      monthlyBudget = smartBudget(newState, totalAvailable, daysInMonth);
      tempWallet.balance = totalAvailable - monthlyBudget;

      console.debug("[DailyBudget] Used smartBudget(). New monthlyBudget:", monthlyBudget);
      console.debug("[DailyBudget] New tempWallet balance:", tempWallet.balance);
    }
  } 
  else {
    newState.DailyBudget.amount = userDailyBudget;
    console.debug("[DailyBudget] No shortage. DailyBudget set directly.");
  }

  remaining = Math.max(0, remaining - monthlyBudget);
  console.debug("[DailyBudget] Final remaining after budget:", remaining);
}


  remaining = fundWishlistItems(newState, remaining);

  if (userDailyBudget === null) {
    monthlyBudget = smartBudget(newState, remaining, daysInMonth);
    remaining -= monthlyBudget;
  }

  newState.MonthlyBudget.amount = monthlyBudget;
  newState.TemporaryWallet.balance += remaining;

  newState.FixedExpenses.expenses.forEach(e => { if (!e.isPermanent) e.durationInMonths--; });  //decreasing month at last 

  console.log("[processSalary] returning:", newState);
  return newState;
}

/**
 * Calculates the ideal smart daily budget and updates state
 * @param {object} state - The current working state
 * @param {number} remaining - The remaining amount after deductions
 * @param {number} daysInMonth - Number of days in current month
 * @returns {number} - Monthly budget value based on smart budgeting
 */
function smartBudget(state, remaining, daysInMonth) {
  console.log("[smartBudget] called with:", { remaining, daysInMonth });

  const dayBudget = splitAmountByDays(remaining, daysInMonth);
  let ideal = dayBudget.dailyAmount;
  ideal = Math.max(state.DailyBudget.min, Math.min(ideal, state.DailyBudget.max));
  const monthlyBudget = parseFloat((ideal * daysInMonth).toFixed(2));

  if (monthlyBudget > remaining) {
    throw new Error("Not enough funds for minimum daily budget.");
  }

  state.DailyBudget.amount = ideal;
  console.log("[smartBudget] returning:", monthlyBudget);
  return monthlyBudget;
}

/**
 * Deduct all unfunded fixed expenses and reset their isPaid status
 * @param {object} state - The current working state
 * @param {number} remaining - The amount remaining from salary
 * @returns {number} - Updated remaining amount
 */
function deductFixedExpenses(state, remaining) {
  console.log("[deductFixedExpenses] called with:", { remaining });

  const expenses = state.FixedExpenses.expenses.filter(
      e => !e.isFunded || e.isPaid
    );

  for (let i = 0; i < expenses.length; i++) {
    const expense = expenses[i];
    // Fund the expense now
    if (remaining >= expense.amountToFund) {
      remaining -= expense.amountToFund;
      expense.amountToFund = 0;
      expense.isFunded = true;
      // expense.durationInMonths--;
      console.debug(`[Funded fully] Expense ${i}`);
    } else if (remaining > 0) {
      expense.amountToFund -= remaining;
      console.debug(`[Funded partially] Expense ${i}, deducted ${remaining}`);
      remaining = 0;
      break;
    }
    expense.isPaid = false;
  }

  console.log("[deductFixedExpenses] remaining after deduction:", remaining);
  return remaining;
}


/**
 * Allocate leftover funds to wishlist items
 * @param {object} state - The current working state
 * @param {number} remaining - The amount left after fixed expenses and budget
 * @returns {number} - Updated remaining amount after wishlist funding
 */
function fundWishlistItems(state, remaining) {
  console.log("[fundWishlistItems] called with:", { remaining });

  const sortedItems = state.Wishlist.items
    .filter(i => i.priority > 0 && i.savedAmount < i.cost && i.monthsToBuy > 0)
    .sort((a, b) => a.priority - b.priority);

  const updatedRemaining = distributeWishlistFunds(sortedItems, remaining);
  console.log("[fundWishlistItems] returning:", updatedRemaining);
  return updatedRemaining;
}

/**
 * Log an expense and update wallets
 * @param {object} state - Current state
 * @param {object} expense - { amount: number, type: 'daily'|'weekly'|'monthly' }
 * @param {Date} currentDate - Current date
 * @returns {object} New state
 */
function logExpense(state, expense, currentDate) {
  console.log("[logExpense] called with:", { expense, currentDate });

  const newState = deepClone(state);
  const normalized = normalizeExpense(expense, currentDate);
  const dailyBudget = newState.DailyBudget.amount;

  if (normalized > dailyBudget) {
    let overage = normalized - dailyBudget;
    const bufferBalance = newState.DailyBuffer.balance;

    if (overage > bufferBalance) {
      overage = overage - bufferBalance;
      newState.DailyBuffer.balance = 0;
      console.warn("Buffer can't satisfy the overage, Try handleTemporaryWalletRequest()");
    } else {
      newState.DailyBuffer.balance = bufferBalance - overage;
      overage = 0;
    }

    newState.TemporaryWallet.balance -= overage; 
  } else if (normalized < dailyBudget) {
    const surplus = dailyBudget - normalized;
    newState.DailyBuffer.balance += surplus;
  }

  console.log("[logExpense] returning:", newState);
  return newState;
}

// ========================
// HELPER FUNCTIONS
// ========================

/**
 * Deep clones a JavaScript object.
 * @param {object} obj - Object to clone.
 * @returns {object} Deep cloned object.
 */
function deepClone(obj) {
  console.debug('deepClone called with:', obj);
  const result = JSON.parse(JSON.stringify(obj));
  console.debug('deepClone returned:', result);
  return result;
}

/**
 * Normalizes an expense amount to its daily equivalent.
 * @param {object} expense - { amount: number, type: string }
 * @param {Date} date - Current date for monthly calculation.
 * @returns {number} Daily normalized amount.
 */
function normalizeExpense(expense, date) {
  console.debug('normalizeExpense called with:', expense, date);
  let result = 0;
  switch (expense.type) {
    case 'daily':
      result = expense.amount;
      break;
    case 'weekly':
      result = parseFloat((expense.amount / 7).toFixed(2));
      break;
    case 'monthly':
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      result = parseFloat((expense.amount / daysInMonth).toFixed(2));
      break;
    default:
      result = 0;
  }
  console.debug('normalizeExpense returned:', result);
  return result;
}

/**
 * Processes a payment toward a fixed expense item.
 * @param {object} state - Current application state.
 * @param {string} expenseId - ID of the fixed expense.
 * @param {number} paidAmount - Amount paid.
 * @returns {object} Updated state.
 */
function handleFixedExpensePayment(state, expenseId, paidAmount) {
  console.debug('handleFixedExpensePayment called with:', expenseId, paidAmount);
  const newState = deepClone(state);
  const expenses = newState.FixedExpenses.expenses;
  const index = expenses.findIndex(e => e.id === expenseId);

  if (index === -1) throw new Error(`Expense with ID ${expenseId} not found.`);
  const expense = expenses[index];
  if (paidAmount > expense.amount) throw new Error(`Payment exceeds ₹${expense.amount}`);

  expense.isPaid = true;
  if (expense.isPermanent) {
    expense.durationInMonths--;
    if (expense.durationInMonths <= 0) {
      expenses.splice(index, 1);
      return newState;
    }
  }

  if (paidAmount < expense.amount) {
    const shortage = expense.amount - paidAmount;
    newState.TemporaryWallet.balance += shortage;
  }

  console.debug('handleFixedExpensePayment returned:', newState);
  return newState;
}

/**
 * Distributes available funds among wishlist items based on priority.
 * @param {Array} sortedItems - Wishlist items sorted by priority.
 * @param {number} available - Available amount.
 * @returns {number} Remaining balance.
 */
function distributeWishlistFunds(sortedItems, available) {
  console.debug('distributeWishlistFunds called with:', sortedItems, available);
  for (const item of sortedItems) {
    const remaining = item.cost - item.savedAmount;
    const monthlyShare = parseFloat((remaining / item.monthsToBuy).toFixed(2));

    if (available >= monthlyShare) {
      const newSaved = item.savedAmount + monthlyShare;
      if (newSaved >= item.cost) {
        const excess = newSaved - item.cost;
        item.savedAmount = item.cost;
        item.monthsToBuy = 0;
        item.status = 'Ready to Buy';
        available -= (monthlyShare - excess);
      } else {
        item.savedAmount = newSaved;
        item.monthsToBuy -= 1;
        available -= monthlyShare;
      }
    } else {
      item.savedAmount += available;
      available = 0;
      break;
    }
  }
  console.debug('distributeWishlistFunds returned:', available);
  return available;
}

/**
 * Funds all wishlist items with available balance.
 * @param {object} state - Current state.
 * @param {number} balance - Available balance.
 * @returns {number} Remaining balance after funding.
 */
function fundAllWishlistItems(state, balance) {
  console.debug('fundAllWishlistItems called with balance:', balance);
  const sortedItems = state.Wishlist.items.filter(i => i.savedAmount < i.cost)
    .sort((a, b) => a.priority - b.priority);

  for (const item of sortedItems) {
    const remaining = item.cost - item.savedAmount;
    if (balance >= remaining) {
      balance -= remaining;
      item.savedAmount = item.cost;
      item.isFunded = true;
      // item.monthsToBuy--;
    } else {
      item.savedAmount += balance;
      balance = 0;
      break;
    }
  }
  console.debug('fundAllWishlistItems returned:', balance);
  return balance;
}

/**
 * Handles requests from TemporaryWallet with fallback to main or saving.
 * @param {object} state - Current state.
 * @param {number} amountRequested - Requested amount.
 * @param {string} sourcePreference - 'main' or 'saving'.
 * @returns {object} - Updated state, amount collected, and sources used.
 */
function handleTemporaryWalletRequest(state, amountRequested, sourcePreference) {
  console.debug('handleTemporaryWalletRequest called with:', amountRequested, sourcePreference);
  const newState = deepClone(state);
  const collected = { amountCollected: 0, sources: [] };

  const fromTemp = Math.min(newState.TemporaryWallet.balance, amountRequested);
  if (fromTemp > 0) {
    newState.TemporaryWallet.balance -= fromTemp;
    collected.amountCollected += fromTemp;
    collected.sources.push({ from: 'TemporaryWallet', amount: fromTemp });
  }

  const shortfall = amountRequested - collected.amountCollected;
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

  newState.TemporaryWallet.balance = collected.amountCollected;
  console.debug('handleTemporaryWalletRequest returned:', collected);
  return { newState, ...collected };
}

/**
 * Deducts money from MainWallet, DailyBuffer, FixedExpenses in order.
 * @param {object} state - Current state.
 * @param {number} needed - Amount required.
 * @returns {object} Amount deducted and sources.
 */
function consumeFromMainPath(state, needed) {
  let total = 0;
  const sources = [];

  const mw = Math.min(state.MainWallet.balance, needed);
  if (mw > 0) {
    state.MainWallet.balance -= mw;
    total += mw;
    sources.push({ from: 'MainWallet', amount: mw });
  }

  if (!state.DailyBuffer.isSelected) {
    const db = Math.min(state.DailyBuffer.balance, needed - total);
    if (db > 0) {
      state.DailyBuffer.balance -= db;
      total += db;
      sources.push({ from: 'DailyBuffer', amount: db });
    }
  }

  const fx = deductFromFixedExpenses(state.FixedExpenses.expenses, needed - total);
  total += fx.amount;
  sources.push(...fx.sources);

  return { amount: total, sources };
}

/**
 * Deducts money from unpaid fixed expenses.
 * @param {Array} expenses - Fixed expense items.
 * @param {number} needed - Amount required.
 * @returns {object} Deducted amount and sources.
 */
function deductFromFixedExpenses(expenses, needed) {
  let total = 0;
  const sources = [];

  for (let i = 0; i < expenses.length && total < needed; i++) {
    
    const item = expenses[i];
    if (!item.isSelected) {
      if (!item.isPaid && item.amount > 0 && item.amountToFund < item.amount) {
        const amountFunded = item.amount - item.amountToFund;
        const take = Math.min(amountFunded, needed - total);
        item.amountToFund += take;
        total += take;
        sources.push({ from: 'FixedExpenses', id: item.id || i, amount: take });
      }
    }
  }

  return { amount: total, sources };
}

/**
 * Deducts money from wishlist savings.
 * @param {object} state - Current state.
 * @param {number} needed - Amount required.
 * @returns {object} Deducted amount and sources.
 */
function consumeFromSavingWishlist(state, needed) {
  const items = state.Wishlist.items.filter(i => i.savedAmount > 0)
    .sort((a, b) => a.priority - b.priority);

  let total = 0;
  const sources = [];

  for (let i = 0; i < items.length && total < needed; i++) {
    const item = items[i];
    if (!item.isSelected) {
      const take = Math.min(item.savedAmount, needed - total);
      item.savedAmount -= take;
      total += take;
      sources.push({ from: 'Wishlist', id: item.id || i, amount: take });
    }
  }

  return { amount: total, sources };
}

/**
 * Deducts fixed expenses and wishlist from TemporaryWallet.
 * @param {object} state - Current state.
 */
function deductTemporaryWallet(state) {
  console.debug('deductTemporaryWallet called');
  let remaining = state.TemporaryWallet.balance;
  remaining = deductFixedExpenses(state, remaining);
  remaining = fundAllWishlistItems(state, remaining);
  state.TemporaryWallet.balance = remaining;
  console.debug('deductTemporaryWallet updated balance:', remaining);
}

/**
 * Adds amount to TemporaryWallet.
 * @param {object} state - Current state.
 * @param {number} amount - Amount to add.
 */
function addToTemporaryWallet(state, amount) {
  console.debug('addToTemporaryWallet called with:', amount);
  state.TemporaryWallet.balance += amount;
}

/**
 * Splits an amount into daily share and leftover.
 * @param {number} amount - Total amount.
 * @param {number} days - Days to split across.
 * @returns {{ dailyAmount: number, leftoverAmount: number }} Split result.
 */
function splitAmountByDays(amount, days) {
  console.debug('splitAmountByDays called with:', amount, days);
  const dailyAmount = Math.floor(amount / days);
  const leftoverAmount = amount - (dailyAmount * days);
  const result = { dailyAmount, leftoverAmount };
  console.debug('splitAmountByDays returned:', result);
  return result;
}

/**
 * Handles expired and non-permanent fixed expense items.
 * Delegates refunding and deletion to helper function.
 *
 * @param {object} state - The application state
 * @returns {number} - Total refunded amount
 */
function handleFixedExpenseItems(state) {
  let totalRefunded = 0;
  const expenses = state.FixedExpenses.expenses;

  // Iterate in reverse to safely splice
  for (let i = expenses.length - 1; i >= 0; i--) {
    const expense = expenses[i];

    if (expense.durationInMonths <= 0 && !expense.isPermanent) {
      totalRefunded += refundAndDeleteExpiredExpense(state, expenses, i);
    }
  }

  return totalRefunded;
}

/**
 * Refunds an expired fixed expense if it was funded and unpaid.
 * Removes the expense from the array.
 *
 * @param {object} state - The application state
 * @param {Array} expenses - The array of fixed expenses
 * @param {number} index - Index of the expense to refund and delete
 * @returns {number} - Amount refunded
 */
function refundAndDeleteExpiredExpense(state, expenses, index) {
  const expense = expenses[index];
  let refundAmount = 0;

  if (!expense.isPaid && expense.isFunded) {
    refundAmount = expense.amount - expense.amountToFund;

    state.TemporaryWallet.balance += refundAmount;

    expense.amountToFund = expense.amount;
    expense.isFunded = false;

    console.debug(
      `[handleFixedExpenseItems] Refunded ₹${refundAmount} for expired expense at index ${index}`,
      expense
    );
  }

  // Remove from array
  expenses.splice(index, 1);
  console.debug(`[handleFixedExpenseItems] Deleted expired expense at index ${index}`);

  return refundAmount;
}

/**
 * Consumes amount from the monthly budget based on the remaining days in the month.
 * Adds extra amount to TemporaryWallet if the amount exceeds the calculated monthly budget.
 *
 * @param {object} state - The application state object.
 * @param {number} amount - The amount to be consumed.
 * @param {string} dateStr - The target date in ISO string format (e.g., "2025-06-30").
 */
function consumeFromMonthlyBudget(state, requiredAmount, dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(dateStr);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate - today;
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const amount = state.DailyBudget.amount * daysLeft;

  const newMonthlyBudget = state.DailyBudget.min * daysLeft;
  state.MonthlyBudget.amount = newMonthlyBudget;
  const extraAmount = amount - newMonthlyBudget;

  console.debug('consumeFromMonthlyBudget: daysLeft =', daysLeft);
  console.debug('consumeFromMonthlyBudget: monthlyBudget =', newMonthlyBudget);
  console.debug('consumeFromMonthlyBudget: extraAmount =', extraAmount);

  if (extraAmount > 0) {
    addToTemporaryWallet(state, extraAmount);
  }

  smartBudget(state, newMonthlyBudget, daysLeft);
}

/**
 * Updates the SteadyWallet's monthly amount and balance based on newMonthlyBudget.
 * Falls back to (DailyBudget.min × 30) if not provided.
 * Automatically handles shortfall/excess from TemporaryWallet.
 *
 * @param {object} state - Full state object containing SteadyWallet, TemporaryWallet, DailyBudget.
 * @param {number|null} [newMonthlyBudget=null] - Optional new monthly budget. If null, uses default.
 */
function updateSteadyWallet(state, newMonthlyBudget) {
  var defaultDays = 30;
  var dailyMin = state.DailyBudget.min;
  var months = state.SteadyWallet.month || 1;
  var previousBalance = state.SteadyWallet.balance;

  if (typeof newMonthlyBudget !== 'number') {
    newMonthlyBudget = dailyMin * defaultDays;
  }

  var newMonthlyBalance = newMonthlyBudget * months;

  console.debug('updateSteadyWallet → Previous Balance:', previousBalance);
  console.debug('updateSteadyWallet → New Monthly Budget:', newMonthlyBudget);
  console.debug('updateSteadyWallet → New Monthly Balance:', newMonthlyBalance);

  if (previousBalance > newMonthlyBalance) {
    var refund = previousBalance - newMonthlyBalance;
    state.TemporaryWallet.balance += refund;
    console.debug('updateSteadyWallet → Refunded to TemporaryWallet:', refund);
  } else if (previousBalance < newMonthlyBalance) {
    var required = newMonthlyBalance - previousBalance;
    if (state.TemporaryWallet.balance >= required) {
      state.TemporaryWallet.balance -= required;
      console.debug('updateSteadyWallet → Taken from TemporaryWallet:', required);
    } else {
      var taken = state.TemporaryWallet.balance;
      state.TemporaryWallet.balance = 0;
      var adjustedMonthly = (previousBalance + taken) / months;

      console.debug('updateSteadyWallet → Insufficient funds. Retrying with adjusted monthly amount:', adjustedMonthly);

      // Recursively retry with what we actually can afford
      updateSteadyWallet(state, adjustedMonthly);
      return;
    }
  }

  // Final update
  state.SteadyWallet.monthlyAmount = newMonthlyBudget;
  state.SteadyWallet.balance = newMonthlyBalance;

  console.debug('updateSteadyWallet → Final MonthlyAmount Set To:', newMonthlyBudget);
  console.debug('updateSteadyWallet → Final Balance Set To:', newMonthlyBalance);
}

/**
 * Transfers funds from TemporaryWallet to MainWallet only if:
 * - MainWallet.balance < state.threshold
 * - TemporaryWallet has a positive balance
 *
 * @param {object} state - Application state containing MainWallet, TemporaryWallet, and threshold
 */
function syncMainFromTemporary(state) {
  'use strict';

  const mainBalance = state.MainWallet.balance;
  const tempBalance = state.TemporaryWallet.balance;
  const threshold = state.threshold;

  console.debug('syncMainFromTemporary → MainWallet Balance:', mainBalance);
  console.debug('syncMainFromTemporary → TemporaryWallet Balance:', tempBalance);
  console.debug('syncMainFromTemporary → Threshold:', threshold);

  if (mainBalance < threshold && tempBalance > 0) {
    const needed = threshold - mainBalance;
    const amountToTransfer = Math.min(needed, tempBalance);

    state.MainWallet.balance += amountToTransfer;
    state.TemporaryWallet.balance -= amountToTransfer;

    console.debug('syncMainFromTemporary → Transferred:', amountToTransfer);
  } else {
    console.debug('syncMainFromTemporary → No transfer needed.');
  }
}
