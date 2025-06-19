import { deepClone } from '../utils/deepClone.js';

/**
 * Processes a payment toward a fixed expense item.
 * @param {object} state - Current application state.
 * @param {string} expenseId - ID of the fixed expense.
 * @param {number} paidAmount - Amount paid.
 * @returns {object} Updated state.
 */
export function handleFixedExpensePayment(state, expenseId, paidAmount) {
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
