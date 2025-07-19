import dayjs from 'dayjs';

export function getDaysUntilSalaryDay(salaryDay: number): number {
  if (salaryDay < 1 || salaryDay > 31) throw new Error('Invalid salary day');

  const today = dayjs();
  const currentMonthDays = today.daysInMonth();
  const clampedDay = Math.min(salaryDay, currentMonthDays);

  // Build target date for this month
  const thisMonthTarget = dayjs(`${today.year()}-${today.month() + 1}-${clampedDay}`, 'YYYY-M-D');

  // If salary day is today or earlier → use next month
  if (!thisMonthTarget.isValid() || !thisMonthTarget.isAfter(today, 'day')) {
    const nextMonth = today.add(1, 'month');
    const nextClampedDay = Math.min(salaryDay, nextMonth.daysInMonth());
    const nextMonthTarget = dayjs(`${nextMonth.year()}-${nextMonth.month() + 1}-${nextClampedDay}`, 'YYYY-M-D');

    return nextMonthTarget.diff(today, 'day');
  }

  // Use this month's salary day
  return thisMonthTarget.diff(today, 'day');
}
