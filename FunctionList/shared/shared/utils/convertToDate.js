/**
 * Returns the next salary date in ISO format (YYYY-MM-DD) based on the given salary day.
 * If today's date is after the salary day, it returns the same day in the next month.
 *
 * @param {number} salaryDay - Day of the month when salary is credited (1-31).
 * @param {Date} [baseDate=new Date()] - The base date to calculate from (default is today).
 * @returns {string} ISO formatted date string of the next salary date.
 */
export function getNextSalaryDateISO(salaryDate, baseDate = new Date()) {
  const salaryDay = salaryDate + 1;
  const currentDay = baseDate.getDate();
  let year = baseDate.getFullYear();
  let month = currentDay > salaryDay ? baseDate.getMonth() + 1 : baseDate.getMonth();

  // Handle December rollover
  if (month > 11) {
    month = 0;
    year += 1;
  }

  const date = new Date(year, month, salaryDay);
  return date.toISOString().split('T')[0];
}

export function getDaysUntilDate(targetDay){
  if (targetDay < 1 || targetDay > 31) throw new Error('Invalid target day');

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed

  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const clampedDay = Math.min(targetDay, daysInCurrentMonth);

  const thisMonthTarget = new Date(year, month, clampedDay);

  if (thisMonthTarget <= today) {
    // target date has passed or is today → go to next month
    const nextMonth = (month + 1) % 12;
    const nextYear = month === 11 ? year + 1 : year;
    const daysInNextMonth = new Date(nextYear, nextMonth + 1, 0).getDate();
    const nextClampedDay = Math.min(targetDay, daysInNextMonth);

    const nextMonthTarget = new Date(nextYear, nextMonth, nextClampedDay);
    return Math.ceil((nextMonthTarget.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  return Math.ceil((thisMonthTarget.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
