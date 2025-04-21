import { isString } from './is-string'

/**
 *  Return argument if string, else undefined
 *
 */
export function asString(str: unknown): string | undefined {
  return isString(str) ? str : undefined
}