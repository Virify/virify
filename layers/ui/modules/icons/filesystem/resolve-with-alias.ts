import { resolve } from 'pathe'
import { resolveAlias } from 'pathe/utils'
import { isObject } from '../utils/is-object'

export interface Alias {
  [key: string]: string
}

/**
 *  Resolve a path whilst taking into account aliases
 *
 */
export function resolveWithAlias(path: string, alias?: Alias) {
  if (!isObject(alias)) return resolve(path)

  return resolve(resolveAlias(path, alias))
}