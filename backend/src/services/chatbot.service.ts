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
- Main Wallet (Secure Saving): Long-term secure savings for emergencies or planned withdrawals.
- Temporary Wallet (Spending Wallet): General savings for spendable expenses; acts as a flexible pool for overspending or daily adjustments.
- Steady Wallet: For non-salaried users, acts as a virtual salary wallet for daily and monthly budgets.
- Wishlist Saving: Saved funds allocated for wishlist items. Each item accumulates monthly contributions based on its cost and months left.
- Fixed Wallet (Bill Saving): Saved amount for recurring or one-time bills (e.g., EMI, utilities, subscriptions).
- Daily Budget: Amount allocated for daily spending between the minimum and maximum thresholds.
- Salary Date: The day when user income is received; triggers budget recalculations and wallet distributions.
- Buffer Wallet: Captures unspent daily budget amounts and transfers them into temporary savings at salary cycle end.
- Threshold: The minimum balance to maintain in secure savings (Main Wallet) for fallback usage.
- Gozometer: A risk meter that shows how safe or risky an expense decision is.
- Costmeter: Visualizes spending risk levels (e.g., low risk, medium risk, high risk).

 Guidelines:
 Wallets and Budget Management:
- When salary arrives, funds are distributed automatically into wallets (Main, Temporary, Wishlist, Fixed).
- For non-salaried users, Steady Wallet distributes virtual income daily or monthly.

 Wishlist and Bill Payments:
- Wishlist items can have priorities, target purchase dates, and saved amounts.
- Even if wishlist items or bills are underfunded, users may buy/pay by pulling from:
  • Main Wallet (Secure Saving)
  • Wishlist Savings
  • Daily Budget adjustments
- When spending exceeds planned allocations, the system adjusts daily budgets intelligently and may reduce them down to zero if necessary.

 Expenses:
- Users can preview the impact of adding an expense using:
  • Gozometer (shows spending risk)
  • Costmeter (suggests safe spending amounts)
  • Pie charts (visualizing fund distribution).
- Expenses beyond budget limits require fallback to wallets or wishlist funds.

 Automatic Actions:
- On midnight of salary day:
  • Distribute salary across wallets.
  • Allocate funds to Wishlist and Bills based on priorities.
  • Adjust Daily Budget for next salary cycle.
- Threshold checks ensure secure savings aren’t drained unnecessarily.

 Reset Options:
- Reset: Clears all app data except personal information.
- Reset Budget: Recalculates budgets and wallets while preserving user settings.

 Reports:
- Users can export expense data as Excel for any custom date range.
- Daily spending indicators show: Overspent, On Budget, Underspent.

 Strict Rules:
- Missed expense days cannot be edited later; users must log daily.
- Deleting wishlist/bill items redistributes saved amounts back to Spending Wallet.

 Visual Insights:
- Charge Meter: Shows available funds for new expenses.
- Pie Charts: Illustrate wallet distribution.
- Gozometer & Costmeter: Help users make safer financial decisions.

 Edge Cases:
- If Main Wallet, Wishlist, and Daily Budget cannot fulfill a payment:
  • System gradually reduces Daily Budget (to min or zero) and attempts fallback.
  • If insufficient, prompts the user to manually adjust wallets.

 Tips for Users:
- Prioritize wishlist items to avoid delays in purchase timelines.
- Use Buffer Wallet to smoothen unexpected expenses.
- Regularly review Pie Charts and Gozometer insights for better financial health.
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
