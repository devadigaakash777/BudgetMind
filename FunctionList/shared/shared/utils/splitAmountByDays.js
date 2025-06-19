/**
 * Splits an amount into equal daily parts, returning dailyAmount and leftoverAmount.
 * Ensures safe division and avoids NaN by validating inputs.
 *
 * @param {number} amount - Total amount to be split.
 * @param {number} days - Number of days to divide the amount by.
 * @returns {{dailyAmount: number, leftoverAmount: number}} Split result.
 */
export function splitAmountByDays(amount, days) {
  console.debug('splitAmountByDays called with:', amount, days);

  if (typeof amount !== 'number' || isNaN(amount)) {
    console.warn('Invalid amount:', amount);
    return { dailyAmount: 0, leftoverAmount: 0 };
  }

  if (typeof days !== 'number' || isNaN(days) || days <= 0) {
    console.warn('Invalid days:', days);
    return { dailyAmount: 0, leftoverAmount: amount };
  }

  const dailyAmount = Math.floor(amount / days);
  const leftoverAmount = amount - (dailyAmount * days);
  const result = { dailyAmount, leftoverAmount };

  console.debug('splitAmountByDays returned:', result);
  return result;
}
