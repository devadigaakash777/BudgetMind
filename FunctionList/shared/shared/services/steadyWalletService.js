/**
 * Updates the SteadyWallet's monthly amount and balance based on newMonthlyBudget.
 * Falls back to (DailyBudget.min × 30) if not provided.
 * Automatically handles shortfall/excess from TemporaryWallet.
 *
 * @param {object} state - Full state object containing SteadyWallet, TemporaryWallet, DailyBudget.
 * @param {number|null} [newMonthlyBudget=null] - Optional new monthly budget. If null, uses default.
 */
export function updateSteadyWallet(state, newMonthlyBudget) {
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