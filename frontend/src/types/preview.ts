import type { UserState } from './user';
import type { BudgetState } from './budget';
import type { DailyExpenseState } from './daily-expense';
import type { WalletState } from './wallet';
import type { WishlistState } from './wishlist';

/**
 * This matches the flattened structure you're storing inside preview,
 * where `User`, `DailyExpense`, and `Wishlist` are nested,
 * and others like `MainWallet`, `MonthlyBudget`, etc., are top-level.
 */
export interface PreviewState {
  // From user slice
  User?: UserState;

  // From budget slice (spread at root)
  MonthlyBudget?: BudgetState['MonthlyBudget'];
  DailyBudget?: BudgetState['DailyBudget'];
  FixedExpenses?: BudgetState['FixedExpenses'];

  // From daily expense slice (under DailyExpense key)
  DailyExpense?: DailyExpenseState;

  // From wallet slice (spread at root)
  MainWallet?: WalletState['MainWallet'];
  TemporaryWallet?: WalletState['TemporaryWallet'];
  SteadyWallet?: WalletState['SteadyWallet'];
  DailyBuffer?: WalletState['DailyBuffer'];
  TotalWealth?: WalletState['TotalWealth'];
  PendingPayments?: WalletState['PendingPayments'];
  threshold?: WalletState['threshold'];

  // From wishlist slice (under Wishlist key)
  Wishlist?: WishlistState;

  // Optional: extra slices you may sync later
  UserDailyExpenses?: unknown; // assuming it exists later
}
