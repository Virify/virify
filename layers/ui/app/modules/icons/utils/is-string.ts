/**
 *  Check if argument is a string
 *
 */
export function isString(str: unknown): str is string {
  return typeof str === 'string'
}

/**
 *  Check an argument is a string with a non-zero length
 *
 */
export function isPopulatedString(str: unknown): boolean {
  return isString(str) && str.length > 0
}