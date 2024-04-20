export const without = <T extends object, K extends keyof T>(object: T, keysToRemove: K[]): Omit<T, K> => {
  return (Object.keys(object) as (keyof T)[]).reduce((acc, key) => {
    if (!keysToRemove.includes(key as K)) {
      acc[key] = object[key];
    }
    return acc;
  }, {} as T);
};
