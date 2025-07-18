import DailyExpense from '../models/expense.model.js';
import dayjs from 'dayjs';

/**
 * Calculates the number of days since the user's last recorded expense.
 * @param {string} userId - User's ID
 * @returns {Promise<number | null>} - Number of days since last expense, or null if no expenses
 */
export const getDaysSinceLastExpense = async (userId: string): Promise<number | null> => {
  const lastExpense = await DailyExpense.findOne({ userId }).sort({ date: -1 });

  if (!lastExpense) {
    console.log('No expenses found for this user.');
    return 1;
  }

  const today = dayjs().startOf('day');
  const lastDate = dayjs(lastExpense.date, 'YYYY-MM-DD');

  const daysBetween = today.diff(lastDate, 'day');
  console.log('Days between:', daysBetween);
  return daysBetween;
};
