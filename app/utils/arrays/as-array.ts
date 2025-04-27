/**
 *  Return argument as an array, optionally forcing non-arrays to arrays
 */
export function asArray<T>(arg: T, forceArray = false): T | T[] {
  if (Array.isArray(arg)) return arg

  return forceArray ? [arg] : []
}