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
- Secure Saving (Main Wallet): Long-term secure savings for emergencies or planned withdrawals.
- Spending Wallet (Temporary Wallet): General savings for spendable expenses; acts as a flexible pool for overspending or daily adjustments.
- Steady Wallet: For non-salaried users, acts as a virtual salary wallet for daily and monthly budgets.
- Wishlist Saving: Saved funds allocated for wishlist items. Each item accumulates monthly contributions based on its cost and months left.
- Bill Saving (Fixed Wallet): Saved amount for recurring or one-time bills (e.g., EMI, utilities, subscriptions).
- Daily Budget: Amount allocated for daily spending between the minimum and maximum thresholds.
- Salary Date: The day when user income is received; triggers budget recalculations and wallet distributions.
- Buffer Wallet: Captures unspent daily budget amounts and transfers them into temporary savings at salary cycle end.
- Threshold: The minimum balance to maintain in secure savings (Main Wallet) for fallback usage.
- Gozometer: A risk meter that shows how safe or risky an expense decision is.
- Costmeter: Visualizes spending risk levels (e.g., low risk, medium risk, high risk).

 Guidelines:
 Wallets and Budget Management:
- When salary arrives, funds are distributed automatically into wallets (Monthly Budget, Wishlist Items, Bills) and remaining amount kept in spending wallet.
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

 Midnight Salary Day Processing:
- At midnight on the user’s salary day, the system automatically:
  • Distributes the received salary across all wallets:
    -  Main Wallet (Secure Savings)
    -  Spending Wallet (Temporary Wallet)
    -  Fixed Wallet (Bill Saving)
    -  Wishlist Savings (for wishlist items)
  • Reallocates funds for:
    - Upcoming Bills (based on their duration and saved status).
    - Wishlist items (according to priority and months left).
  • Adjusts the user’s Daily Budget for the next salary cycle:
    - Considers minimum and maximum daily budget settings.
    - Accounts for any unpaid bills or wishlist items.  

 Threshold Checks:
- If Secure Savings (Main Wallet) is below its set threshold:
  • The system attempts to refill it from:
    - Temporary Wallet (Spending Wallet)
    - Wishlist Savings (if enabled by user)
  • Refills are performed in stages:
    - 100% of threshold if possible
    - If not, 50%, then 10%, 5%, and finally 1%.
  • If threshold cannot be met immediately, system retries on subsequent midnights.

 Buffer Wallet Handling:
- Any **unused daily budget** at the end of the day is moved to the Buffer Wallet.  
- On salary day, the Buffer Wallet is cleared into Temporary Wallet for flexible use.

 Auto-Fallback Logic:
- If there are insufficient funds in Spending Wallet for a required payment:
  • System pulls from Main Wallet (if allowed).
  • Or deducts from Wishlist Savings or adjusts Daily Budget down to minimum/zero.


 Reset Options:
- Reset: Clears all app data except personal information.
- Reset Budget: Recalculates budgets and wallets while preserving user settings.

 Reports:
- Users can export expense data as Excel for any custom date range.
- Daily spending indicators show: Overspent, On Budget, Underspent.

 Strict Rules:
- Missed expense days can be edited later until previous day of salary day at 11:45 PM ; users must log at least previous day of salary day.
- Deleting wishlist/bill items redistributes saved amounts back to Spending Wallet.

 Visual Insights:
  - Bar Chart: Displays current month expenses for each category, helping users track where their money is going.  
  - Pie Charts: Illustrate wallet distribution (Main Wallet, Spending Wallet, Wishlist Savings, Fixed Wallet, etc.) for a clear financial overview.  
  - Gozometer & Costmeter: Risk indicators that guide users to make safer spending decisions based on available funds and priorities.  

  Tip Box:  
  - Advises users on the **maximum safe amount** they can spend from the Spending Wallet to:  
    Avoid unpaid bill payments.  
    Prevent delays in Wishlist item purchases.  
    Maintain at least their current Daily Budget.  

   Note:  
  - If the user can access **all funds in the Spending Wallet without restrictions**, the Tip Box will not appear.  


  Edge Cases:  
- If the system cannot fulfill a payment from Spending Wallet:  
   It does NOT automatically pull from:  
    • Main Wallet (Secure Saving)  
    • Wishlist Savings  
    • Daily Budget  

 Instead, the user is prompted with manual options to decide fallback sources:  
   Take funds from Main Wallet (Secure Saving).  
   Take funds from Wishlist Savings (with priority rules applied).  
  
  Tips for Users:  
-  Prioritize Wishlist items: Assign priorities to Wishlist products carefully. Lower priority items will have their saved funds used first if you need to pull from Wishlist Savings.  
-  Track timelines: Stick to system recommendations to avoid delays in purchasing Wishlist items within the target month.  
-  Use the Buffer Wallet wisely: Unspent daily budgets accumulate here and help with unexpected expenses later.  
-  Monitor Bar Charts: Review monthly expense trends to understand where most of your spending goes.  
-  Follow Tip Box advice: Spend within the safe limit suggested in the Tip Box to avoid:  
  • Unpaid bills.  
  • Delays in Wishlist funding.  
  • Reduction in your Daily Budget.  
-  Avoid excessive manual withdrawals from Secure Saving and Wishlist Saving unless absolutely necessary. These are designed for long-term goals.  
-  Adjust your salary, thresholds, or budget settings if your financial situation changes.  

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
