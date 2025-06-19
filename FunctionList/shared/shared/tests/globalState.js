export const globalState = {
  User: {
    id: 99,
    hasSalary: true
  },
  MainWallet: {
    balance: 1000,
    isSelected: false
  },
  TemporaryWallet: {
    balance: 500
  },
  SteadyWallet: {
    balance: 18000,
    month: 6, // valid: 1–12
    date: 15,  // day of month salary comes
    monthlyAmount: 3000,
    isSelected: false
  },
  Wishlist: {
    items: [
      {
        id: 'A',
        savedAmount: 1000,
        priority: 3,
        cost: 5000,
        monthsToBuy: 5,
        isFunded: false,
        isSelected: false
      },
      {
        id: 'B',
        savedAmount: 1500,
        priority: 1,
        cost: 3000,
        monthsToBuy: 3,
        isFunded: false,
        isSelected: false
      }
    ]
  },
  DailyBuffer: {
    balance: 200,
    isSelected: false
  },
  FixedExpenses: {
    expenses: [
      {
        id: 1,
        isPaid: false,
        amount: 1200,
        isPermanent: true,
        isFunded: false,
        durationInMonths: 3,
        amountToFund: 1200,
        isSelected: false
      },
      {
        id: 2,
        isPaid: false,
        amount: 1800,
        isPermanent: true,
        isFunded: false,
        durationInMonths: 1,
        amountToFund: 1800,
        isSelected: false
      }
    ]
  },
  MonthlyBudget: {
    amount: 3000,
    fundedAmount: 3000
  },
  DailyBudget: {
    amount: 100,
    min: 50,
    max: 400
  },
  TotalWealth: {
    amount: 5000
  },
  Salary: {
    amount: 10000,
    date: 17 // day of salary credit
  },
  PendingPayments: {
    amount: 0
  },
  threshold: 500,
  UserDailyExpenses: []
};
