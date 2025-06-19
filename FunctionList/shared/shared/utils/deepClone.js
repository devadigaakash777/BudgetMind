/**
 * Deep clones a JavaScript object.
 * @param {object} obj - Object to clone.
 * @returns {object} Deep cloned object.
 */
export function deepClone(obj) {
  if (obj === undefined) {
    throw new Error("deepClone called with undefined");
  }
  console.debug('deepClone called with:', obj);
  const result = JSON.parse(JSON.stringify(obj));
  console.debug('deepClone returned:', result);
  return result;
}
