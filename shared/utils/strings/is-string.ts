/**
 *  Check if argument is a string
 *
 */
export function isString(str: unknown): str is string {
  return !!str && typeof str === 'string'
}
