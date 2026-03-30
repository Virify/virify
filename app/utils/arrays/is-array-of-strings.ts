import { isString } from '../strings'

export function isArrayOfStrings(arr: unknown): arr is string[] {
  return Array.isArray(arr) && arr.every(isString)
}