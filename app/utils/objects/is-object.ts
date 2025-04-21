/**
 *  Check if argument is an object
 *
 */
export function isObject(obj: unknown): obj is Record<string, unknown> {
  return !!obj && typeof obj === 'object' && !Array.isArray(obj)
}
