import { getActiveOptions } from './get-active-options'

const featuresDictionary: Record<string, string> = {
  'garage': 'have a garage',
  'off-street-parking': 'have off-street parking',
  'disabled-access': 'have disability access',
  'garden': 'have a garden',
  'pets': 'are pet-friendly',
}

export function buildFeaturesQuery(options: Record<string, boolean>) {
  const activeOptions = getActiveOptions(options)

  if (!activeOptions.length) return ''

  const readableOptions = activeOptions.map((option) => featuresDictionary[option]).filter(Boolean)

  return `that ${readableOptions.join(' and ')}`
}