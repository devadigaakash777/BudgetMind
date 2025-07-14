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
  console.debug(
      `[consumeFromMainPath] called with requirement of ₹${needed},`
    );

  let total = 0;
  const sources = [];

  const mw = Math.min(state.MainWallet.balance, needed);
  if (mw > 0) {
    state.MainWallet.balance -= mw;
    total += mw;
    sources.push({ from: 'MainWallet', amount: mw });
  }

  const fx = deductFromFixedExpenses(state.FixedExpenses.expenses, needed - total);
  console.debug('[consumeFromMainPath] after deductFromFixedExpenses fx amount is ',fx.amount,' and totalSavedAmount ',state.FixedExpenses.totalSavedAmount );
  state.FixedExpenses.totalSavedAmount -= fx.amount;
  total += fx.amount;
  sources.push(...fx.sources);

  console.debug(
      `[consumeFromMainPath] returned with ₹${total} requirement of ₹${needed},`
    );

  return { amount: total, sources };
}

/**
 * Deducts money from unpaid fixed expenses.
 * @param {Array} expenses - Fixed expense items.
 * @param {number} needed - Amount required.
 * @returns {object} Deducted amount and sources.
 */
export function deductFromFixedExpenses(expenses, needed) {
  console.debug(
      `[handleFixedExpenseItems] called with requirement of ₹${needed},`
    );
  let total = 0;
  const sources = [];

  for (let i = 0; i < expenses.length && total < needed; i++) {
    
    const item = expenses[i];
    if (!item.isSelected) {
      if (!item.isPaid && item.amount > 0 && item.amountToFund < item.amount) {
        const amountFunded = item.amount - item.amountToFund;
        const take = Math.min(amountFunded, needed - total);
        item.amountToFund += take;
        item.isFunded = false;
        total += take;
        sources.push({ from: 'FixedExpenses', id: item.id || i, amount: take });
      }
    }
  }
  console.debug(
      `[handleFixedExpenseItems] returned ₹${total} and requirement is ₹${needed},`
    );
  return { amount: total, sources };
}

/**
 * Calculates how much can be deducted from a wishlist item.
 * @param {object} item - Wishlist item.
 * @returns {number} Monthly share amount (rounded to 2 decimal places).
 */
function getMonthlyShare(item) {
  const remaining = item.cost - item.savedAmount;
  const months = item.monthLeft || 1; // Prevent division by 0
  return parseFloat((remaining / months).toFixed(2));
}

/**
 * Deducts money from wishlist savings following priority and monthlyShare rules.
 * @param {object} state - Redux state.
 * @param {number} needed - Required amount.
 * @returns {object} Object with deducted amount and sources.
 */
export function consumeFromSavingWishlist(state, needed) {
  const items = state.Wishlist.items
    .filter(i => i.savedAmount > 0 && !i.isSelected)
    .sort((a, b) => a.priority - b.priority);

  let totalDeducted = 0;
  const deductionSources = [];

  // First handle priority 0 items - take all savedAmount at once
  for (const item of items) {
    if (item.priority === 0 && totalDeducted < needed) {
      const take = Math.min(item.savedAmount, needed - totalDeducted);
      item.savedAmount -= take;
      totalDeducted += take;
      deductionSources.push({ from: 'Wishlist', id: item.id, amount: take });
    }
  }

  // Handle other priorities in rounds (multiple passes)
  while (totalDeducted < needed) {
    let deductedThisRound = 0;

    for (const item of items) {
      if (item.priority !== 0 && item.savedAmount > 0 && totalDeducted < needed) {
        const monthlyShare = getMonthlyShare(item);
        if (monthlyShare <= 0) continue; // skip broken logic

        const amountToTake = Math.min(monthlyShare, item.savedAmount, needed - totalDeducted);

        item.savedAmount -= amountToTake;
        totalDeducted += amountToTake;
        deductedThisRound += amountToTake;

        // If already deducted before, increase amount; else add new entry
        const existing = deductionSources.find(src => src.id === item.id);
        if (existing) {
          existing.amount += amountToTake;
        } else {
          deductionSources.push({ from: 'Wishlist', id: item.id, amount: amountToTake });
        }

        if (amountToTake >= monthlyShare / 2) {
          item.monthLeft = (item.monthLeft || 0) + 1;
        }
      }
    }

    // If no progress in a round, break to avoid infinite loop
    if (deductedThisRound === 0) break;
  }

  state.Wishlist.totalSavedAmount -= totalDeducted;

  return {
    amount: totalDeducted,
    sources: deductionSources
  };
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
