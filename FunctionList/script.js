import * as handlers from './shared/shared/index.js';

Object.entries(handlers).forEach(([key, value]) => {
  window[key] = value; // ✅ exposes all exported functions globally
});

console.debug('🧠 Wallet Debug Tools Loaded');

// // Optional: define your state globally to play with
// window.state = {
//   User: { hasSalary: false, Salary: { amount: 0, date: 1 } },
//   MainWallet: { balance: 50000 },
//   TemporaryWallet: { balance: 20000 },
//   SteadyWallet: { balance: 0, month: 0, date: 1, monthlyAmount: 20000 },
//   Wishlist: {
//     items: [
//       { id: 'A', savedAmount: 5000, priority: 3, cost: 10000, monthLeft: 5, isFunded: false },
//       { id: 'B', savedAmount: 1500, priority: 1, cost: 3000, monthLeft: 3, isFunded: false}
//     ]
//   },
//   DailyBuffer: { balance: 0 },
//   FixedExpenses: {
//     expenses: [
//       { id: 1, isPaid: false, amount: 1500, isPermanent: true, isFunded: false, durationInMonths: 3, amountToFund: 1500 },
//       { id: 2, isPaid: true, amount: 2000, isPermanent: true, isFunded: false, durationInMonths: 1, amountToFund: 2000 },
//       { id: 3, isPaid: false, amount: 800, isPermanent: true, isFunded: false, durationInMonths: 2, amountToFund: 800 }
//     ]
//   },
//   MonthlyBudget: { amount: 0 },
//   DailyBudget: { amount: 500, min: 100, max: 500 }, // added min and max
//   TotalWealth: { amount: 100000 },
//   PendingPayments: { amount: 0 },
//   threshold: 50000
// };


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

// window.state = {
//   User: {
//     salary: { amount: 50000, date: 1 },
//     _id: '686290df1104b063309591d8',
//     userId: '686115e1a30a4213cafd297a',
//     __v: 3,
//     address: [ [Object] ],
//     hasSalary: true,
//     isProfileComplete: true,
//     isSalaryPaid: false,
//     jobTitle: 'Senior Developer',
//     phone: '9876543210'
//   },
//   MainWallet: { balance: 102 },
//   TemporaryWallet: { balance: 0 },
//   SteadyWallet: { balance: 0, month: 5, date: 15, monthlyAmount: 3000 },
//   DailyBuffer: { balance: 0 },
//   TotalWealth: { amount: 0 },
//   PendingPayments: { amount: 0 },
//   _id: '68638fc3f6e180b1f3d76961',
//   userId: '686115e1a30a4213cafd297a',
//   threshold: 0,
//   __v: 0,
//   MonthlyBudget: { amount: 0, amountFunded: 0 },
//   DailyBudget: { amount: 0, setAmount: 200, min: 150, max: 300 },
//   FixedExpenses: { expenses:[], rowsPerPage: 3, totalSavedAmount: 0 },
//   _id: '6862548c0b5237f0785ebd6d',
//   userId: '686115e1a30a4213cafd297a',
//   __v: 0
// }

window.state = {
  User: {
    _id: '686290df1104b063309591d8',
    userId: '686115e1a30a4213cafd297a',
    __v: 7,
    address: "nothing",
    hasSalary: true,
    isProfileComplete: true,
    isSalaryPaid: false,
    jobTitle: 'Senior Developer',
    salary: { amount: 3000, date: 1 },
    phone: '9876543210'
  },
  _id: '68638fc3f6e180b1f3d76961',
  userId: '686115e1a30a4213cafd297a',
  MainWallet: { balance: 19 },
  TemporaryWallet: { balance: 50 },
  SteadyWallet: { balance: 0, month: 5, date: 15, monthlyAmount: 3000 },
  DailyBuffer: { balance: 20 },
  TotalWealth: { amount: 70000 },
  PendingPayments: { amount: 0 },
  threshold: 50000,
  __v: 0,
  MonthlyBudget: { amount: 2100, amountFunded: 4650 },
  DailyBudget: { amount: 150, setAmount: 0, min: 100, max: 1500 },
  FixedExpenses: {
    expenses: [ {
      _id: '6867bf7e5ac13c14bd0148dc',
      userId: '686115e1a30a4213cafd297a',
      billName: 'Electricity Bill',
      status: 'pending',
      dueDate: 9,
      isPaid: false,
      amount: 3000,
      isPermanent: true,
      isFunded: false,
      durationInMonths: 1,
      amountToFund: 3000,
      __v: 0
    },
   {
      _id: '6867bf7e5ac13c1456d0148dc',
      userId: '686115e1a30a4213cafd297a',
      billName: 'Electricity Bill',
      status: 'pending',
      dueDate: 9,
      isPaid: false,
      amount: 5000,
      isPermanent: true,
      isFunded: false,
      durationInMonths: 1,
      amountToFund: 4999,
      __v: 0
    } 
   ],
    totalSavedAmount: 1
  },
  Wishlist: {
    items: [{
      _id: '6863c365f6e180b1f3d769c3',
      userId: '686115e1a30a4213cafd297a',
      name: 'Mobile',
      description: 'Gaming mobile',
      image: 'https://res.cloudinary.com/ddmlou0da/image/upload/v1751368444/py8gjmvmvnxtlpijo7ej.jpg',
      savedAmount: 2010,
      priority: 7,
      cost: 49999,
      monthLeft: 9,
      isFunded: false,
      __v: 0
    } ],
    totalSavedAmount: 2010
  }
}

// [], Whishlist