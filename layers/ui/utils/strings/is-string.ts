/**
 *  Check whether an argument is a string
 *
 */
export function isString(str: unknown): str is string {
  return typeof str === 'string'
}