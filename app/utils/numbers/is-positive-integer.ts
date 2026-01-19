export function isPositiveInteger(num: unknown): boolean {
  return Number.isInteger(num) && (num as number) > 0
}