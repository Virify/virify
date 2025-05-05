import { isOptionObject } from '../objects'

export function isArrayOfOptions(arr: unknown): arr is string[] {
  return Array.isArray(arr) && arr.every(isOptionObject)
}