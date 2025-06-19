import { monthlyAllocate } from '../handlers/monthlyAllocate.js'

describe('monthlyAllocate', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      User: { hasSalary: true },
      MainWallet: { balance: 50000 },
      TemporaryWallet: { balance: 50000 },
      SteadyWallet: { balance: 0, month: 12, date: 15, monthlyAmount: 5000 },
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
      DailyBudget: { amount: 0, min: 50, max: 400 }, // corrected min/max to match comments and logic
      TotalWealth: { amount: 100000 },
      Salary: { amount: 0, date: 17 }, // salary day = 17
      PendingPayments: { amount: 0 },
      threshold: 50000
    };

  });

  it('should return unchanged state if not salary day or steady day', () => {
    const currentDate = new Date(2025, 5, 10); // day = 10
    const result = monthlyAllocate(initialState, currentDate);
    expect(result).toEqual(initialState);
  });

  it('should process salary on salary day', () => {
    const currentDate = new Date(2025, 5, 17); // salary date = 17
    const result = monthlyAllocate(initialState, currentDate);
    expect(result).not.toEqual(initialState);
    expect(result.Salary.amount).toBeGreaterThan(0);
    expect(result.MonthlyBudget.fundedAmount).toBeGreaterThanOrEqual(0);
  });

  it('should process steady wallet on steady wallet day (when user has no salary)', () => {
    initialState.User.hasSalary = false;
    const currentDate = new Date(2025, 5, 15); // steady wallet date = 15
    const result = monthlyAllocate(initialState, currentDate);
    expect(result).not.toEqual(initialState);
    expect(result.Salary.amount).toBe(initialState.SteadyWallet.monthlyAmount);
    expect(result.SteadyWallet.month).toBeLessThan(12);
  });

  it('should use provided salary override on salary day', () => {
    const overrideSalary = 7000;
    const currentDate = new Date(2025, 5, 17); // salary date = 17
    const result = monthlyAllocate(initialState, currentDate, overrideSalary);
    expect(result.Salary.amount).toBe(overrideSalary);
  });

  it('should respect userDailyBudget override if provided', () => {
    const overrideDailyBudget = 300;
    const currentDate = new Date(2025, 5, 17); // salary day = 17
    const result = monthlyAllocate(initialState, currentDate, null, overrideDailyBudget);
    expect(result.DailyBudget.amount).toBe(overrideDailyBudget);
  });

  it('should clamp userDailyBudget override if below min', () => {
    const overrideDailyBudget = 20; // below min = 50
    const currentDate = new Date(2025, 5, 17); // salary day = 17
    const result = monthlyAllocate(initialState, currentDate, null, overrideDailyBudget);
    expect(result.DailyBudget.amount).toBe(initialState.DailyBudget.min);
  });

  it('should clamp userDailyBudget override if above max', () => {
    const overrideDailyBudget = 500; // above max = 400
    const currentDate = new Date(2025, 5, 17); // salary day = 17
    const result = monthlyAllocate(initialState, currentDate, null, overrideDailyBudget);
    expect(result.DailyBudget.amount).toBe(initialState.DailyBudget.max);
  });

});
