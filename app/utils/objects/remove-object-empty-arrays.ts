type O = Record<string, unknown>

/**
 *  Remove empty arrays from an object
 */
export function removeObjectEmptyArrays<T extends O>(obj: T): Partial<T> {
  if (!isObject) throw new TypeError('Argument must be an object')

  // Convert to an array
  const objectAsArray = Object.entries(obj)

  // Loop through and remove any non-arrays, or empty arrays
  const filteredObjectAsArray = objectAsArray.filter(([_, value]) => {
    return Array.isArray(value) && value.length
  })

  // Return as object
  return Object.fromEntries(filteredObjectAsArray) as Partial<T>;
}