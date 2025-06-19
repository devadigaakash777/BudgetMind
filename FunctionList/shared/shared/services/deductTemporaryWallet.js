import { fundAllWishlistItems } from './fundWishlist.js';
import { deductFixedExpenses } from './fixedExpenses.js';

/**
 * Deducts fixed expenses and wishlist from TemporaryWallet.
 * @param {object} state - Current state.
 */
export function deductTemporaryWallet(state) {
  console.debug('deductTemporaryWallet called');
  let remaining = state.TemporaryWallet.balance;
  remaining = deductFixedExpenses(state, remaining);
  remaining = fundAllWishlistItems(state, remaining);
  state.TemporaryWallet.balance = remaining;
  console.debug('deductTemporaryWallet updated balance:', remaining);
}

/**
 * Adds amount to TemporaryWallet.
 * @param {object} state - Current state.
 * @param {number} amount - Amount to add.
 */
export function addToTemporaryWallet(state, amount) {
  console.debug('addToTemporaryWallet called with:', amount);
  state.TemporaryWallet.balance += amount;
}

