import { isNonEmptyURL } from 'ufo'

/**
 *  Check if input is an array of non-empty URLs
 *
 */
export function isArrayOfUrls(input: unknown): input is string[] {
  if (!Array.isArray(input)) return false

  return input.every(isNonEmptyURL)
}