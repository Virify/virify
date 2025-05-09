import { isOptionObject } from '../objects'

interface Option {
  key: string
  value: string
}

export function isArrayOfOptions(arr: unknown): arr is Option[] {
  return Array.isArray(arr) && arr.every(isOptionObject)
}

export function asArrayOfOptions(arr: unknown): Option[] {
  if (isArrayOfStrings(arr)) {
    return arr.map(str => ({
      value: str,
      key: str
    }))
  }

  if (isArrayOfOptions(arr)) {
    return arr
  }

  return []
}