import type { MinMax } from './types'

export const buildbedroomQuery = (min: MinMax, max: MinMax): string => {
  if (min === 0.5) min = 1
  if (max === 0.5) max = 1
  // @TODO
  // The 'studio' keyword isn't yet supported, but this can later be:
  // if (min === 0.5) min = 'studio'
  // if (max === 0.5) max = 'studio'
  if (max === 9) max = '9+'
  if (min === max || min === 8) {
    if (min === 0.5) return 'has a studio bedroom'

    return `${max} bedroom${max === 1 ? '' : 's'}`
  }

  return `between ${min} and ${max} bedrooms`
}