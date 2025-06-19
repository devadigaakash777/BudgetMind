/**
 * Transfers funds from TemporaryWallet to MainWallet only if:
 * - MainWallet.balance < state.threshold
 * - TemporaryWallet has a positive balance
 *
 * @param {object} state - Application state containing MainWallet, TemporaryWallet, and threshold
 */
export function syncMainFromTemporary(state) {
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