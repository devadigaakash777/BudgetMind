import { consumeFromMonthlyBudget } from '../services/consumeFromMonthlyBudget.js';
import { getNextSalaryDateISO } from '../utils/convertToDate.js';

/**
 * Attempts to consume from the monthly budget.
 * @param {object} state - Current state (will be mutated).
 * @param {number} amountRequested - Total requested amount.
 * @param {boolean} hasBudgetPaid - Whether today's budget has been paid.
 * @param {object} collected - Object to update collected data.
 * @returns {number} - Remaining shortfall after attempt.
 */
export function tryConsumeFromMonthlyBudget(state, amountRequested, hasBudgetPaid, collected, unpaidDuration) {
  const originalBudget = state.DailyBudget.amount;
  let salaryDay = state.User.hasSalary ? state.User.salary.date : state.steadyWallet.date;
  salaryDay -= 1;

  const salaryDate = getNextSalaryDateISO(salaryDay);
  let extraAmount = 0;

  console.debug(salaryDate);

  extraAmount = consumeFromMonthlyBudget(state, unpaidDuration, null, salaryDate);
  // try {
  //   extraAmount = consumeFromMonthlyBudget(state, unpaidDuration, amountRequested, salaryDate);
  // } catch (err) {
  //   extraAmount = consumeFromMonthlyBudget(state, unpaidDuration, null, salaryDate);
  //   console.warn("cant satisfy the request go with handleTemporaryWallet");
  // }

  if (hasBudgetPaid) {
    console.debug("Today's Budget already used");
    amountRequested -= extraAmount.totalRemaining;
    collected.amountCollected += extraAmount.totalRemaining;
  } else {
    console.debug("Budget still remaining");
    const releasedAmount = originalBudget - extraAmount.smartDailyBudget;
    collected.amountCollected += extraAmount.totalRemaining;
    collected.freedBudget = releasedAmount;
    console.debug(amountRequested," = ",extraAmount.totalRemaining," - ",releasedAmount * unpaidDuration);
    amountRequested -= (extraAmount.totalRemaining - (releasedAmount * unpaidDuration));
    console.debug("[trConsumeBudget] :");
  }

  return Math.max(amountRequested, 0);
}
