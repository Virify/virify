/**
 *  Check if an input is a function
 *
 */
export function isFunction(fn: unknown): fn is typeof Function {
  return !!fn && typeof fn === 'function'
}