export function getEnumValues<T extends string | number>(e: Record<string, T>): T[] {
  return typeof e === 'object' ? Object.values(e) : [];
}
