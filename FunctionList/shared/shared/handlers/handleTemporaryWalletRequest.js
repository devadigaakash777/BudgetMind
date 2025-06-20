import { deepClone } from '../utils/deepClone.js';
import { consumeFromMainPath } from '../services/fixedExpenses.js';
import { consumeFromSavingWishlist } from '../services/fixedExpenses.js';

/**
 * Handles requests from TemporaryWallet with fallback to main or saving.
 * @param {object} state - Current state.
 * @param {number} amountRequested - Requested amount.
 * @param {string} sourcePreference - 'main' or 'saving'.
 * @returns {object} - Updated state, amount collected, and sources used.
 */
export function handleTemporaryWalletRequest(state, amountRequested, sourcePreference) {
  console.debug('handleTemporaryWalletRequest called with:', amountRequested, sourcePreference);
  const newState = deepClone(state);
  const collected = { amountCollected: 0, sources: [] };

  const fromTemp = Math.min(newState.TemporaryWallet.balance, amountRequested);
  if (fromTemp > 0) {
    newState.TemporaryWallet.balance -= fromTemp;
    collected.amountCollected += fromTemp;
    collected.sources.push({ from: 'TemporaryWallet', amount: fromTemp });
  }

  const shortfall = amountRequested - collected.amountCollected;
  if (shortfall > 0) {
    let result = { amount: 0, sources: [] };

    if (sourcePreference === 'main') {
      if (!newState.MainWallet.isSelected) {
        result = consumeFromMainPath(newState, shortfall);
      }else{
        console.warn("Can't request money for MainWallet by MainWallet");
      }
    } 
    else {
      result = consumeFromSavingWishlist(newState, shortfall);
    }

    if (result.amount > 0 && Array.isArray(result.sources)) {
      collected.amountCollected += result.amount;
      collected.sources = collected.sources.concat(result.sources);
    }
  }

  newState.TemporaryWallet.balance = collected.amountCollected;
  console.debug('handleTemporaryWalletRequest returned:', collected);
  return { newState, ...collected };
}