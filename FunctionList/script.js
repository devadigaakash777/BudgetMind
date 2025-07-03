import * as handlers from './shared/shared/index.js';

Object.entries(handlers).forEach(([key, value]) => {
  window[key] = value; // ✅ exposes all exported functions globally
});

console.debug('🧠 Wallet Debug Tools Loaded');

// // Optional: define your state globally to play with
window.state = {
  User: { hasSalary: false, Salary: { amount: 0, date: 1 } },
  MainWallet: { balance: 50000 },
  TemporaryWallet: { balance: 20000 },
  SteadyWallet: { balance: 0, month: 0, date: 1, monthlyAmount: 20000 },
  Wishlist: {
    items: [
      { id: 'A', savedAmount: 5000, priority: 3, cost: 10000, monthLeft: 5, isFunded: false },
      { id: 'B', savedAmount: 1500, priority: 1, cost: 3000, monthLeft: 3, isFunded: false}
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
  DailyBudget: { amount: 500, min: 100, max: 500 }, // added min and max
  TotalWealth: { amount: 100000 },
  PendingPayments: { amount: 0 },
  threshold: 50000
};


// window.state = {
//   User: { hasSalary: false, Salary: { amount: 0, date: 1 } },
//   MainWallet: { balance: 0 },
//   TemporaryWallet: { balance: 0 },
//   SteadyWallet: { balance: 0, month: 4, date: 1, monthlyAmount: 4000 },
//   Wishlist: { items: [] },
//   DailyBuffer: { balance: 0 },
//   FixedExpenses: { expenses: [] },
//   MonthlyBudget: { amount: 0 },
//   DailyBudget: { amount: 0, min: 100, max: 500 },
//   TotalWealth: { amount: 0 },
//   PendingPayments: { amount: 0 },
//   threshold: 0 // User-defined threshold for MainWallet
// };

