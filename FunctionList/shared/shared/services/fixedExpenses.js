/**
 * Deduct all unfunded fixed expenses and reset their isPaid status
 * @param {object} state - The current working state
 * @param {number} remaining - The amount remaining from salary
 * @returns {number} - Updated remaining amount
 */
export function deductFixedExpenses(state, remaining) {
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
 * Deducts money from MainWallet, DailyBuffer, FixedExpenses in order.
 * @param {object} state - Current state.
 * @param {number} needed - Amount required.
 * @returns {object} Amount deducted and sources.
 */
export function consumeFromMainPath(state, needed) {
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
export function deductFromFixedExpenses(expenses, needed) {
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
export function consumeFromSavingWishlist(state, needed) {
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
 * Handles expired and non-permanent fixed expense items.
 * Delegates refunding and deletion to helper function.
 *
 * @param {object} state - The application state
 * @returns {number} - Total refunded amount
 */
export function handleFixedExpenseItems(state) {
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
export function refundAndDeleteExpiredExpense(state, expenses, index) {
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
