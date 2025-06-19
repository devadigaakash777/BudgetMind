/**
 * Normalize the given expense over a number of days
 * @param {object} expense - { amount: number, duration?: number }
 * @param {Date} currentDate - The date when the expense is logged
 * @returns {number} Daily expense equivalent
 */
export function normalizeExpense(expense, currentDate) {
  const { amount, duration } = expense;

  if (!duration || duration <= 1) return amount;

  return parseFloat((amount / duration).toFixed(2)); // spread equally
}
