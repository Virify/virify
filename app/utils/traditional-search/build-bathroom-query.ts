import type { MinMax } from './types'

export function buildBathroomQuery(min: MinMax, max: MinMax): string {
  if (max === 6) max = '6+'
  if (min === max || min === 5) {
    return `${max} bathroom${max === 1 ? '' : 's'}`
  }

  return `between ${min} and ${max} bathrooms`
}