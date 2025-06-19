/**
 * Get number of days from today to either end of the month or a specific target date.
 * 
 * @param {Date|string|null} targetDate - Optional. If null, calculates days till end of the month. 
 *                                        Can be a Date object or a valid date string (e.g., "2025-06-30").
 * @returns {number} Number of days (rounded up) between today and the target date.
 */
export function getDaysRemaining(targetDate = null) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to midnight

  let endDate;

  if (targetDate === null) {
    // End of current month
    endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  } else {
    endDate = new Date(targetDate);
  }

  endDate.setHours(0, 0, 0, 0); // Normalize too

  const diffTime = endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(diffDays, 0); // Return 0 if target date is before today
}
