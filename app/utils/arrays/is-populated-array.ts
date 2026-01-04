import { asArray } from './as-array'

/**
 * Check if a value is a populated array (non-empty array)
 * Uses asArray internally for safe conversion
 */
export function isPopulatedArray(arr: unknown): boolean {
  return !!asArray(arr).length
}

/**
 * Check if any of the provided values are populated arrays
 */
export function containsPopulatedArray(...arrs: unknown[]): boolean {
  return arrs.some(isPopulatedArray)
}

/**
 * Check if all provided values are populated arrays
 */
export function containsOnlyPopulatedArrays(...arrs: unknown[]): boolean {
  return arrs.every(isPopulatedArray)
}
