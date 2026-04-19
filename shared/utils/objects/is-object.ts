/**
 *  Check if argument is an object
 *
 */
export function isObject(obj: unknown): obj is Record<string, unknown> {
  return !!obj && typeof obj === 'object' && !Array.isArray(obj)
}

/**
 *  Check if argument is object with keys
 *
 */
export function isNonEmptyObject(obj: unknown): boolean {
  return isObject(obj) && !!Object.keys(obj).length
}