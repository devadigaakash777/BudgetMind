import { getNextSalaryDateISO } from '@/utils/shared';
import { monthlyAllocate } from '@/utils/shared';
import type { PreviewState } from '@/types/preview';

type newBudgetResult = {
  TemporaryWallet: any;
  newState: PreviewState;
};

/**
 * Simulates monthly allocation without dispatching or mutating global state.
 *
 * @param state - The current preview state
 * @returns New temporary wallet balance after simulation
 */
export const simulateMonthlyAllocation = (state: PreviewState): number => {
  if (Object.keys(state).length === 0) return 0;

  const salaryDayISO = getNextSalaryDateISO(state.User?.salary.date);
  const salary = state.User?.salary.amount;
  const dailyBudget = state.DailyBudget?.amount;

  const newState = monthlyAllocate(
    state,
    new Date(salaryDayISO),
    salary,
    dailyBudget
  ) as newBudgetResult;
  return newState?.TemporaryWallet?.balance;
};


/**
 * It calculate Minimum Spending Wallet Amount required to Keep a current
 * State to next Month.
 *
 * @param state - The current preview state
 * @returns New temporary wallet balance after simulation
 */
export const calculateRequiredAmount = (state: PreviewState): number => {
  if (Object.keys(state).length === 0) return 0;

  const tempWallet = state.TemporaryWallet?.balance || 0;
  const salary = state.User?.salary.amount || 0;
  const buffer = state.DailyBuffer?.balance || 0;
  const totalMoneySource = tempWallet + salary + buffer;

  const items = state.Wishlist?.items.filter(i => i.savedAmount < i.cost) || [];
  let itemsCost = 0;
  for (const item of items) {
    const remaining = item.cost - item.savedAmount;
    itemsCost += Math.floor(remaining / item.monthLeft);
  }

  const bills = state.FixedExpenses?.expenses.filter(i =>
    i.isPermanent ||
    (i.isPaid && i.durationInMonths > 1) ||
    (!i.isPaid && i.durationInMonths > 2)
  ) || [];
  
  let billsCost = 0;
  for (const bill of bills) {
    billsCost += bill.amount;
  }

  const monthlyBudget = state.MonthlyBudget?.amountFunded || 0;
  const totalExpense = monthlyBudget + billsCost + itemsCost;
  const safeAccess = Math.max(totalMoneySource - totalExpense, 0); 

  const result = {
    tempWallet,
    salary,
    totalMoneySource,
    itemsCost,
    billsCost,
    monthlyBudget,
    totalExpense,
    safeAccess
  }
  console.log(result);
  return safeAccess;
};
