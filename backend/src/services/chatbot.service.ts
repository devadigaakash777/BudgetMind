import fetch from 'node-fetch';
import NodeCache from 'node-cache'; 

import Profile from '../models/profile.model.js';
import User from '../models/User.js';
import { Wallet } from '../models/wallet.model.js';
import { BudgetSummary, FixedExpense } from '../models/budget.model.js';
import { WishlistItem, WishlistSummary } from '../models/wishlist.model.js';
import DailyExpense from '../models/expense.model.js';

// ✅ Initialize cache
export const contextCache = new NodeCache({ stdTTL: 300 }); // 5 minutes

export const globalAppTerms = `
Terminology:
- Main Wallet: General savings
- Temporary Wallet: Monthly expenses
- Steady Wallet: Long-term investments
- Wishlist Wallet: Optional savings
- Fixed Wallet: Bill payments
- Daily Budget: Money available for daily use
- Salary Date: When user receives income

Guidelines:
- Users allocate salary into these wallets.
- Budget, wishlist, and fixed expenses are all interconnected.
`;

export const getUserContext = async (userId: string): Promise<string> => {
  const [user, profile, wallet, budget, wishlistSummary] = await Promise.all([
    User.findById(userId),
    Profile.findOne({ userId }),
    Wallet.findOne({ userId }),
    BudgetSummary.findOne({ userId }),
    WishlistSummary.findOne({ userId })
  ]);

  if (!user || !profile || !wallet || !budget) {
    return 'User data is incomplete.';
  }

  const userInfo = `
User Info:
- Name: ${user.firstName} ${user.lastName}
- Job Title: ${profile.jobTitle || 'N/A'}
- Salary: ₹${profile.salary?.amount ?? 0} on date ${profile.salary?.date ?? 1}
- Is Salary Paid: ${profile.isSalaryPaid ? 'Yes' : 'No'}
- Daily Budget: ₹${budget.DailyBudget.amount}
`;

  const walletInfo = `
Wallet Balances:
- Main: ₹${wallet.MainWallet.balance}
- Temporary: ₹${wallet.TemporaryWallet.balance}
- Steady: ₹${wallet.SteadyWallet.balance}
- Daily Buffer: ₹${wallet.DailyBuffer.balance}
- Total Wealth: ₹${wallet.TotalWealth.amount}
- Pending Payments: ₹${wallet.PendingPayments.amount}
- Threshold: ₹${wallet.threshold}
`;

  const budgetInfo = `
Budget Summary:
- Monthly Budget: ₹${budget.MonthlyBudget.amount}
- Fixed Expense Saved: ₹${budget.FixedExpenses.totalSavedAmount}
- Daily Range: ₹${budget.DailyBudget.min}–₹${budget.DailyBudget.max}
`;

  const wishlistInfo = `
Wishlist Summary:
- Total Saved for Wishlist: ₹${wishlistSummary?.totalSavedAmount ?? 0}
`;

  return `${userInfo}\n${walletInfo}\n${budgetInfo}\n${wishlistInfo}`;
};
