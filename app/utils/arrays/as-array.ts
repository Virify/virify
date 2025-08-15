/**
 *  Return argument as an array, optionally forcing non-arrays to arrays
 */
function asArray<T>(arg: T[], forceArray?: boolean): T[]
function asArray<T>(arg: T[], forceArray?: false): T[]
function asArray<T>(arg: T, forceArray?: false): []
function asArray<T>(arg: T[], forceArray: true): T[]
function asArray<T>(arg: T, forceArray: true): T[]
function asArray<T>(arg: T, forceArray = false): T | T[] | [] {
  if (Array.isArray(arg)) return arg

  return forceArray ? [arg] : []
}

export { asArray }