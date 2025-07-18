import { isObject } from './is-object'

/**
 *  Return argument if object, else empty object
 *
 */
export function asObject<T extends object>(obj: T): T
export function asObject<T>(obj: T): {}
export function asObject<T>(obj: T): T {
  return isObject(obj) ? obj : {} as T
}
