/**
 * Parses gradient text markers in strings and converts them to HTML with gradient-text class.
 * Supports the format: {gradient}text{/gradient}
 * 
 * @param text - The text containing gradient markers
 * @returns HTML string with gradient spans, or the original text if no markers found
 * 
 * @example
 * parseGradientText('Join the {gradient}future{/gradient} of property')
 * // Returns: 'Join the <span class="gradient-text">future</span> of property'
 */
export function parseGradientText(text: string): string {
  if (!text) return text
  
  // Replace {gradient}content{/gradient} with <span class="gradient-text">content</span>
  return text.replace(/\{gradient\}(.*?)\{\/gradient\}/g, '<span class="gradient-text">$1</span>')
}

/**
 * Checks if text contains gradient markers
 * @param text - The text to check
 * @returns True if gradient markers are present
 */
export function hasGradientMarkers(text: string): boolean {
  if (!text) return false
  return /\{gradient\}.*?\{\/gradient\}/.test(text)
}
