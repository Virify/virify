const DEFAULT_DELIMITER = ''

/**
 *  Split a string by a given delimiter
 *
 */
export function getSplitString(str: string, delimiter: string = DEFAULT_DELIMITER): string[] {
  // Ensure delimiter is a string
  if (!isString(delimiter)) delimiter = DEFAULT_DELIMITER

  // If input to split is not a string, return an empty array
  if (!isString(str)) return []

  // Else return string, split by delimiter
  return str.split(delimiter)
}