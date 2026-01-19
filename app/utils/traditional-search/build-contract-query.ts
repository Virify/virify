import { getActiveOptions } from './get-active-options'

const includesDictionary: Record<string, string> = {
  'sold-stc': 'sold subject to contract',
  'cash-only': 'auction or cash only',
  'shared-ownership': 'shared ownership',
  'retirement': 'retirement properties',
  'let-agreed': 'let agreed',
  'long-term-lets': 'short-term lets',
  'short-term-lets': 'long-term lets',
}

export function buildContractQuery(options: Record<string, boolean>) {
  const activeOptions = getActiveOptions(options)

  if (!activeOptions.length) return ''

  const readableOptions = activeOptions.map((option) => includesDictionary[option]).filter(Boolean)

  return `are ${readableOptions.join(' or ')}`
}