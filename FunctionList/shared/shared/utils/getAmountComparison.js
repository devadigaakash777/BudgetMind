/**
 * Compares two numeric values and returns how much they differ
 * and whether the first is above, below, or equal to the second.
 *
 * @param {number} value1 - The first numeric value.
 * @param {number} value2 - The second numeric value to compare against.
 * @returns {{ amountDifference: number|null, amountStatus: string }}
 * An object containing:
 *   - amountDifference: the absolute difference between the values (or null if invalid)
 *   - amountStatus: "above" if value1 < value2,
 *                   "below" if value1 > value2,
 *                   "equal" if they are the same,
 *                   "invalid" if inputs are not numbers.
 */
export function getAmountComparison(value1, value2) {
    // Input validation
    if (typeof value1 !== "number" || typeof value2 !== "number" || isNaN(value1) || isNaN(value2)) {
        return {
            amountDifference: null,
            amountStatus: "invalid"
        };
    }

    const diff = value1 - value2;
    const amountDifference = Math.abs(diff);
    let amountStatus;

    if (diff > 0) {
        amountStatus = "below";
    } else if (diff < 0) {
        amountStatus = "above";
    } else {
        amountStatus = "equal";
    }

    return {
        amountDifference,
        amountStatus
    };
}
