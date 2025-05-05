import { isObject } from './is-object'
import { isString } from '../strings'

interface Option {
  key: string
  value: string
}

export function isOptionObject(arg: unknown): arg is Option {
  return isObject(arg) && isString(arg.key) && isString(arg.value)
}