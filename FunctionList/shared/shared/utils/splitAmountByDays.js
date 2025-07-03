/**
 * Splits an amount into equal daily parts, returning dailyAmount and leftoverAmount.
 * Ensures safe division and avoids NaN by validating inputs.
 *
 * @param {number} max - max amount that can be given as daily budget
 * @param {number} amount - Total amount to be split.
 * @param {number} days - Number of days to divide the amount by.
 * @returns {{dailyAmount: number, leftoverAmount: number}} Split result.
 */
export function splitAmountByDays(max, amount, days) {
  console.debug('splitAmountByDays called with:', amount, days);

  if (typeof amount !== 'number' || isNaN(amount)) {
    console.warn('Invalid amount:', amount);
    return { dailyAmount: 0, leftoverAmount: 0 };
  }

  if (typeof days !== 'number' || isNaN(days) || days <= 0) {
    console.warn('Invalid days:', days);
    return { dailyAmount: 0, leftoverAmount: amount };
  }

  const maxAmount = max * days;
  
  // To avoid Daily budget exceed maximum
  let excessAmount = 0;
  if(maxAmount < amount) {
    excessAmount = amount - maxAmount;
    amount = maxAmount;
  }

  const dailyAmount = Math.floor(amount / days);
  const leftoverAmount = (amount - (dailyAmount * days)) + excessAmount;
  const result = { dailyAmount, leftoverAmount };

  console.debug('splitAmountByDays returned:', result);
  return result;
}
