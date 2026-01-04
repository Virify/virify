/**
 * Parses gradient text markers and returns an array of text parts with gradient flags.
 * Supports the format: {gradient}text{/gradient}
 * 
 * @param text - The text containing gradient markers
 * @returns Array of text parts with isGradient flag
 * 
 * @example
 * parseGradientTextParts('Join the {gradient}future{/gradient} of property')
 * // Returns: [
 * //   { text: 'Join the ', isGradient: false },
 * //   { text: 'future', isGradient: true },
 * //   { text: ' of property', isGradient: false }
 * // ]
 */
export function parseGradientTextParts(text: string): Array<{ text: string; isGradient: boolean }> {
  if (!text) return []
  
  const parts: Array<{ text: string; isGradient: boolean }> = []
  const regex = /\{gradient\}(.*?)\{\/gradient\}/g
  let lastIndex = 0
  let match
  
  while ((match = regex.exec(text)) !== null) {
    // Add text before the gradient marker
    if (match.index > lastIndex) {
      parts.push({
        text: text.substring(lastIndex, match.index),
        isGradient: false
      })
    }
    
    // Add the gradient text
    parts.push({
      text: match[1] || '',
      isGradient: true
    })
    
    lastIndex = regex.lastIndex
  }
  
  // Add remaining text after last gradient marker
  if (lastIndex < text.length) {
    parts.push({
      text: text.substring(lastIndex),
      isGradient: false
    })
  }
  
  return parts
}

/**
 * Parses gradient text markers in strings and converts them to HTML with gradient-text class.
 * Supports the format: {gradient}text{/gradient}
 * 
 * @param text - The text containing gradient markers
 * @returns HTML string with gradient spans, or the original text if no markers found
 * @deprecated Use parseGradientTextParts instead for safe rendering
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
