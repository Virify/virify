/**
 *  Check if an argument is an object
 *
 */
export function isObject(arg: unknown): arg is Object {
  return !!arg && !Array.isArray(arg) && arg instanceof Object
}