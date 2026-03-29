import { isStringy } from '../../../shared/utils/strings'

interface Option {
  key: string | number
  value: string | number
}

export function isOptionObject(arg: unknown): arg is Option {
  return isObject(arg) && isStringy(arg.key) && isStringy(arg.value)
}