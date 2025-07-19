import { isObject } from './is-object'

/**
 *  Return argument if object, else empty object
 *
 */
export function asObject<T extends object>(obj: T): T
export function asObject<T extends unknown>(obj: T): Record<string, unknown>
export function asObject(obj: unknown): Record<string, unknown> {
  return isObject(obj) ? obj : {}
}