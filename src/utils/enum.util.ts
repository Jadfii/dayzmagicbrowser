export function getEnumValues<T extends string | number>(e: any): T[] {
  return typeof e === 'object' ? Object.values(e) : [];
}
