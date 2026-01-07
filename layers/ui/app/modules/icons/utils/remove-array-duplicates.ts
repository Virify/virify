/**
 *  Remove duplicates from an array
 *
 */
export function removeArrayDuplicates<T>(arr: T[]): T[] {
  return Array.isArray(arr) ? [...new Set(arr)] : []
}