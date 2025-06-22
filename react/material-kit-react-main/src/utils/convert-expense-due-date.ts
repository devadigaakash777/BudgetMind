/**
 * Converts expense due date between day number and full date string.
 * @param value - Day number (1-31) or date string 'YYYY-MM-DD'
 * @param mode - Convert mode:
 *    'toString' → convert day number to date string.
 *    'toNumber' → convert date string to day number.
 * @returns Converted value (string or number)
 *
 * Example:
 * convertExpenseDueDate(2, 'toString') → '2025-06-02'
 * convertExpenseDueDate('2025-06-02', 'toNumber') → 2
 */
export function convertExpenseDueDate(
  value: number | string,
  mode: 'toString' | 'toNumber'
): string | number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // JS month 0-based → +1

  const padZero = (num: number): string => (num < 10 ? '0' + num : '' + num);

  // Get last day of current month
  const lastDayOfMonth = new Date(year, month, 0).getDate();

  if (mode === 'toString') {
    // input: number → output: YYYY-MM-DD
    let day = typeof value === 'number' ? value : parseInt(value, 10);
    if (isNaN(day) || day < 1) day = 1;
    if (day > lastDayOfMonth) day = lastDayOfMonth;

    return `${year}-${padZero(month)}-${padZero(day)}`;
  } else if (mode === 'toNumber') {
    // input: 'YYYY-MM-DD' → output: number
    if (typeof value !== 'string') {
      return 1;
    }
    const parts = value.split('-');
    if (parts.length !== 3) {
      return 1;
    }
    const day = parseInt(parts[2], 10);
    if (isNaN(day) || day < 1) {
      return 1;
    }
    return day > lastDayOfMonth ? lastDayOfMonth : day;
  } else {
    throw new Error('Invalid mode: use "toString" or "toNumber"');
  }
}
