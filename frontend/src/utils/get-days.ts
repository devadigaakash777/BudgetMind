import dayjs from 'dayjs';

export function getDaysUntilSalaryDay(salaryDay: number): number {
  if (salaryDay < 1 || salaryDay > 31) throw new Error('Invalid salary day');

  const today = dayjs();
  const currentMonth = today.month();
  const currentYear = today.year();

  // Try to set salary day in current month
  let target = dayjs(`${currentYear}-${currentMonth + 1}-${salaryDay}`, 'YYYY-M-D', true);

  // If invalid (e.g., Feb 30) or already passed today → try next month
  if (!target.isValid() || target.isBefore(today, 'day')) {
    const nextMonth = today.add(1, 'month');
    const nextMonthDays = nextMonth.daysInMonth();

    // Clamp salaryDay to last valid day of that month
    const clampedDay = Math.min(salaryDay, nextMonthDays);
    target = dayjs(`${nextMonth.year()}-${nextMonth.month() + 1}-${clampedDay}`, 'YYYY-M-D');
  }

  return target.diff(today, 'day');
}
