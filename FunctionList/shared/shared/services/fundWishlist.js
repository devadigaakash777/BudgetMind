/**
 * Funds all wishlist items with available balance.
 * @param {object} state - Current state.
 * @param {number} balance - Available balance.
 * @returns {number} Remaining balance after funding.
 */
export function fundAllWishlistItems(state, balance) {
  console.debug('fundAllWishlistItems called with balance:', balance);
  const sortedItems = state.Wishlist.items.filter(i => i.savedAmount < i.cost)
    .sort((a, b) => a.priority - b.priority);

  for (const item of sortedItems) {
    const remaining = item.cost - item.savedAmount;
    if (balance >= remaining) {
      balance -= remaining;
      item.savedAmount = item.cost;
      item.isFunded = true;
      // item.monthsToBuy--;
    } else {
      item.savedAmount += balance;
      balance = 0;
      break;
    }
  }
  console.debug('fundAllWishlistItems returned:', balance);
  return balance;
}

/**
 * Distributes available funds among wishlist items based on priority.
 * @param {Array} sortedItems - Wishlist items sorted by priority.
 * @param {number} available - Available amount.
 * @returns {number} Remaining balance.
 */
export function distributeWishlistFunds(sortedItems, available) {
  console.debug('distributeWishlistFunds called with:', sortedItems, available);
  for (const item of sortedItems) {
    const remaining = item.cost - item.savedAmount;
    const monthlyShare = parseFloat((remaining / item.monthLeft).toFixed(2));

    if (available >= monthlyShare) {
      const newSaved = item.savedAmount + monthlyShare;
      if (newSaved >= item.cost) {
        const excess = newSaved - item.cost;
        item.savedAmount = item.cost;
        item.monthLeft = 0;
        item.isFunded = true;
        // item.status = 'Ready to Buy';
        available -= (monthlyShare - excess);
      } else {
        item.savedAmount = newSaved;
        available -= monthlyShare;
        item.isFunded = true;
      }
    // } else {
    //   item.savedAmount += available;
    //   available = 0;
    //   break;
    }
  }
  console.debug('distributeWishlistFunds returned:', available);
  return available;
}

/**
 * Allocate leftover funds to wishlist items
 * @param {object} state - The current working state
 * @param {number} remaining - The amount left after fixed expenses and budget
 * @returns {number} - Updated remaining amount after wishlist funding
 */
export function fundWishlistItems(state, remaining) {
  console.log("[fundWishlistItems] called with:", { remaining });

  const sortedItems = state.Wishlist.items
    .filter(i => i.priority > 0 && !i.isFunded && i.savedAmount < i.cost && i.monthLeft > 0)
    .sort((a, b) => a.priority - b.priority);

  const updatedRemaining = distributeWishlistFunds(sortedItems, remaining);
  console.log("[fundWishlistItems] returning:", updatedRemaining);
  return updatedRemaining;
}