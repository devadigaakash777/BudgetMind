export function mergeByExistingKeys<T extends object>(
    target: T,
    source: Partial<T>
): T {
    if (!source || typeof source !== "object") {
        console.warn("mergeByExistingKeys: source is invalid, returning target as-is");
        return target;
    }

    const result = { ...target };

    Object.keys(target).forEach((key) => {
        if (key in source) {
            // Only update keys that exist in target
            (result as any)[key] = (source as any)[key];
        }
    });

    return result;
}
