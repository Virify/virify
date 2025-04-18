import { basename } from 'pathe'
import { svgParser } from './svg-parser'
import { minifySring, createSvg, createSymbol } from './svg-constructors'

/**
 *  Create an SVG sprite from a list of file paths
 * 
 */
export function generateSpriteAsString(filePaths: string[]): string {
  let svg = ''

  // Loop through all SVGs and log output
  for (const path of filePaths) {
    const { viewBox, svgContent } = svgParser(path)

    // Get name to use as ID for symbol
    const name = basename(path, '.svg')

    // Add symbol to SVG content
    svg += createSymbol(name, svgContent, viewBox)
  }

  // Wrap SVG in new <svg> tag
  svg = createSvg(svg)

  // Minify SVG and return
  return minifySring(svg)
}