import { DailyExpense } from '@/redux/slices/dailyExpensesSlice';

/**
 * Filters expenses to return only those from the current month.
 *
 * @param {DailyExpense[]} data - Array of daily expense entries
 * @returns {DailyExpense[]} - Only the expenses from the current month
 */
export function filterCurrentMonth(data: DailyExpense[]): DailyExpense[] {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  return data.filter((entry) => {
    const entryDate = new Date(entry.date);
    return entryDate.getMonth() === month && entryDate.getFullYear() === year;
  });
}
