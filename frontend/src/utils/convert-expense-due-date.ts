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

// 🔁 Moved to outer scope (Fixes: unicorn/consistent-function-scoping)
const padZero = (num: number): string => (num < 10 ? `0${num}` : `${num}`);

export function convertExpenseDueDate(
  value: number | string,
  mode: 'toString' | 'toNumber'
): string | number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const lastDayOfMonth = new Date(year, month, 0).getDate();

  if (mode === 'toString') {
    let day = typeof value === 'number' ? value : Number.parseInt(value, 10);
    if (Number.isNaN(day) || day < 1) day = 1;
    day = Math.min(day, lastDayOfMonth);
    return `${year}-${padZero(month)}-${padZero(day)}`;
  }

  if (mode === 'toNumber') {
    if (typeof value !== 'string') return 1;
    const parts = value.split('-');
    if (parts.length !== 3) return 1;

    const day = Number.parseInt(parts[2], 10);                                
    if (Number.isNaN(day) || day < 1) return 1;
    return Math.min(day, lastDayOfMonth);
  }

  throw new Error('Invalid mode: use "toString" or "toNumber"');
}
