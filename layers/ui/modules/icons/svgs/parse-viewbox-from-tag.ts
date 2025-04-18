type NumberString = `${number}`
type ViewBox = `${number} ${number} ${number} ${number}`

/**
 *  Get a matched group from a RegExp match
 *
 */
function getRegexMatchGroup<T = string>(str: string, pattern: RegExp): T | undefined {
  try {
    const [_, match] = str.match(pattern) as unknown[] as T[]

    return match as T
  }
  catch {
    return undefined
  }
}

/**
 *  Extract a viewbox from a tag
 *
 */
export function parseViewboxFromTag(tag: string): ViewBox | undefined {
  const viewBox = getRegexMatchGroup(tag, /viewBox="([\d\s]+)"/)

  // If a viewbox is ground, return it
  if (viewBox) return viewBox as ViewBox

  // Otherwise extract with and height from tag
  const width = getRegexMatchGroup<NumberString>(tag, /width="(\d+)"/)
  const height = getRegexMatchGroup<NumberString>(tag, /height="(\d+)"/)

  // If no width of height exists, return empty string
  if (!width || !height) return

  // And return a constructed viewbox
  return `0 0 ${width} ${height}`
}