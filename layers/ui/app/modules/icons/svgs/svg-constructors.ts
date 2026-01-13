/**
 *  Remove whitespace from a string
 */
export function minifySring(str: string) {
  return str
    // Remove new lines
    .replace(/\n/g, ' ')
    // Remove double-spaces
    .replace(/\s+/g, ' ')
    // Remove spaces between HTML tags
    .replace(/>\s</g, '><')
    // Remove spaces before HTML tags
    .replace(/<\s/g, '<')
    // Remove spaces after HTML tags
    .replace(/\s>/g, '>')
    // Remove trailing whitespace
    .trim()
}

/**
 *  Create SVG wrapper
 *
 */
export function createSvg(svgContent: string): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg">
  ${svgContent}
</svg>`
}

/**
 *  Create viewBox attribute
 *
 */
function createViewBoxAttribute(viewBox?: string) {
  if (!viewBox) return ''

  return `viewBox="${viewBox}"`
}

/**
 *  Create SVG symbol
 *
 */
export function createSymbol(name: string, content: string, viewBox?: string): string {
  const viewBoxAttr = createViewBoxAttribute(viewBox)

  return `
<symbol
  id="${name}"
  fill="none"
  ${viewBoxAttr}
>
  ${content}
</symbol>`
}