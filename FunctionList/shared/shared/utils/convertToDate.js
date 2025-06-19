/**
 * Returns the next salary date in ISO format (YYYY-MM-DD) based on the given salary day.
 * If today's date is after the salary day, it returns the same day in the next month.
 *
 * @param {number} salaryDay - Day of the month when salary is credited (1-31).
 * @param {Date} [baseDate=new Date()] - The base date to calculate from (default is today).
 * @returns {string} ISO formatted date string of the next salary date.
 */
export function getNextSalaryDateISO(salaryDay, baseDate = new Date()) {
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
