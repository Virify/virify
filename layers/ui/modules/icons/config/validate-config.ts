import { isNonEmptyURL } from 'ufo'
import { removeArrayDuplicates } from '../utils/remove-array-duplicates'
import { isArrayOfUrls } from '../filesystem/is-array-of-urls'
import { resolveWithAlias, type Alias } from '../filesystem/resolve-with-alias'

interface IconsConfig {
  input?: string | string[]
  output?: string
}

interface ValidatedConfig {
  input: string[]
  output: string
}

/**
 *  Validate icon config
 *
 */
export function validateConfig({ input, output }: IconsConfig, aliases: Alias): ValidatedConfig {
  const hasInput = input && (isArrayOfUrls(input) || isNonEmptyURL(input))
  const hasOutput = output && isNonEmptyURL(output)

  // Validate inputs
  if (!hasInput) {
    throw new TypeError('No input provided to icon config')
  }

  if (!hasOutput) {
    throw new TypeError('No output provided to icon config')
  }

  // Ensure inputs is an array
  if (!Array.isArray(input)) input = [input] as string[]

  // Remove duplicate paths
  input = removeArrayDuplicates(input)

  // Return paths as absolute URLS
  return {
    input: input.map(e => resolveWithAlias(e, aliases)),
    output: resolveWithAlias(output, aliases)
  }
}