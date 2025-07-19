import { readFileSync } from 'node:fs'
import { parseViewboxFromTag } from './parse-viewbox-from-tag'

interface ParsedSvg {
  viewBox: string | undefined
  svgContent: string
}

/**
 *  Regex patterns
 */
const matchOpeningTag = /(?:.*)(<svg(?:\s[^>]*)?>)/g
const matchClosingTag = /(?:<\/svg>)/g

/**
 *  Parse an SVG file
 *
 */
export function svgParser(path: string): ParsedSvg {
  const fileContent = readFileSync(path, { encoding: 'utf-8' })

  try {
    /**
     *  Split file content into distinct tags
     *
     *  @note
     *  The initial argument '_' accounts for any pre-opening-tag content
     */
    const [_, openingTag, afterTag] = fileContent.split(matchOpeningTag)
    const [svgContentRaw] = typeof afterTag === 'string' ? afterTag.split(matchClosingTag) : ['']
    const svgContent = svgContentRaw ?? ''

    // Get viewBox and width/height (to construct viewbox if none exists)
    const viewBox = openingTag ? parseViewboxFromTag(openingTag) : undefined

    // Return relevant values
    return {
      viewBox,
      svgContent
    }
  }
  catch {
    return {
      viewBox: undefined,
      svgContent: ''
    }
  }
}