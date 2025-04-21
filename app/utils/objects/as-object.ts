import { isObject } from './is-object'

/**
 *  Return argument if object, else empty object
 *
 */
export function asObject(obj: unknown): Record<string, unknown> {
  return isObject(obj) ? obj : {}
}