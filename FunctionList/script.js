import * as handlers from './shared/shared/index.js';

Object.entries(handlers).forEach(([key, value]) => {
  window[key] = value; // ✅ exposes all exported functions globally
});

console.debug('🧠 Wallet Debug Tools Loaded');

// // Optional: define your state globally to play with
window.state = {
  User: { hasSalary: true },
  MainWallet: { balance: 50000 },
  TemporaryWallet: { balance: 50000 },
  SteadyWallet: { balance: 0, month: 12, date: 1, monthlyAmount: 5000 },
  Wishlist: {
    items: [
      { id: 'A', savedAmount: 5000, priority: 3, cost: 10000, monthsToBuy: 5, isFunded: false },
      { id: 'B', savedAmount: 1500, priority: 1, cost: 3000, monthsToBuy: 3, isFunded: false}
    ]
  },
  DailyBuffer: { balance: 0 },
  FixedExpenses: {
    expenses: [
      { id: 1, isPaid: false, amount: 1500, isPermanent: true, isFunded: false, durationInMonths: 3, amountToFund: 1500 },
      { id: 2, isPaid: true, amount: 2000, isPermanent: true, isFunded: false, durationInMonths: 1, amountToFund: 2000 },
      { id: 3, isPaid: false, amount: 800, isPermanent: true, isFunded: false, durationInMonths: 2, amountToFund: 800 }
    ]
  },
  MonthlyBudget: { amount: 0 },
  DailyBudget: { amount: 0, min: 100, max: 500 }, // added min and max
  TotalWealth: { amount: 100000 },
  Salary: { amount: 0, date: 1 }, // today is salary day
  PendingPayments: { amount: 0 },
  threshold: 50000
};




