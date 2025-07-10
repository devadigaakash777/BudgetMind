export function mergeByExistingKeys<T extends object>(
  target: T,
  source: Partial<T>
): T {
  if (!source || typeof source !== "object") {
    console.warn("mergeByExistingKeys: source is invalid, returning target as-is");
    return target;
  }

  const result = { ...target };
  const excludedKeys = ['userId', '__v', '_id']; // skip these keys

  Object.keys(target).forEach((key) => {
    if (key in source && !excludedKeys.includes(key)) {
      // Only update keys that exist in target and are not excluded
      (result as any)[key] = (source as any)[key];
    }
  });

  return result;
}
