/**
 * Add DailyBuffer balance to TemporaryWallet.
 * This is a one-time transfer operation.
 * 
 * @param {object} state - Current application state
 */
export function addDailyBufferToTemporaryWallet(state) {
  if (state.DailyBuffer.balance > 0) {
    state.TemporaryWallet.balance += state.DailyBuffer.balance;
    console.debug('[DailyBuffer ➜ TemporaryWallet]', {
      transferred: state.DailyBuffer.balance
    });
    state.DailyBuffer.balance = 0;
  } else {
    console.debug('DailyBuffer is already empty.');
  }
}
