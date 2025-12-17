import { selectOptionRadius } from '~/utils/select-options/radius'

/**
 * Sanitise text for use in URL paths
 * Converts to lowercase, replaces non-alphanumeric chars with hyphens,
 * and removes leading/trailing hyphens
 * Preserves £ symbol as 'gbp' for better readability
 */
export function sanitisePath(text: string | number): string {
  return String(text)
    .toLowerCase()
    .replace(/£/g, 'gbp')  // Preserve currency symbol as 'gbp'
    .replace(/[^a-z0-9-]+/g, '-')  // Allow hyphens through (for ranges like 2-4)
    .replace(/--+/g, '-')  // Collapse multiple hyphens into one
    .replace(/^-|-$/g, '')  // Remove leading/trailing hyphens
}

/**
 * Get valid radius options from the select options
 */
const validRadiusOptions = selectOptionRadius.map(opt => opt.value)

/**
 * Get a sanitised radius slug for URLs
 */
export function getSanitisedRadius(radius: number | string | undefined): string {
  const radiusNumber = Number(radius)
  
  // Match original: radius === 0 ? 'this-area-only' : `${radius || 5}-miles`
  if (radiusNumber === 0) return 'this-area-only'
  return `${radiusNumber || 5}-miles`
}

/**
 * Create a search URL from location, radius, and query
 * Includes location ID as query param for precise lookup
 * Uses shortened location name for cleaner URLs (e.g. "newport-wales" not "newport-united-kingdom")
 */
export function createSearchURL(
  location: {
    id?: string
    text?: string
    place_name_en?: string
    place_name?: string
  },
  radius: number,
  query: string
): string {
  // Use place_name directly from MapTiler
  const locationText = location.place_name_en || location.place_name || ''
  const locationSlug = sanitisePath(locationText)
  const radiusSlug = getSanitisedRadius(radius)
  const promptSlug = sanitisePath(query)
  
  // Add location ID as query param for precise lookup on page load
  const baseUrl = `/search/${locationSlug}/${radiusSlug}/${promptSlug}`
  return location.id ? `${baseUrl}?lid=${encodeURIComponent(location.id)}` : baseUrl
}

/**
 * Parse radius from URL param (e.g., "5-miles" -> 5, "this-area-only" -> 0)
 */
export function parseRadiusFromSlug(radiusParam: string): number {
  if (radiusParam === 'this-area-only') return 0
  // Handle decimal radii like "0-25-miles" -> 0.25
  const match = radiusParam.match(/^(\d+(?:-\d+)?)-miles?$/)
  if (match?.[1]) {
    // Convert "0-25" back to "0.25"
    return parseFloat(match[1].replace('-', '.'))
  }
  return 5 // Default
}

/**
 * Convert slug back to readable text (e.g., "3-bed-house-with-garden" -> "3 bed house with garden")
 * Preserves hyphens in number ranges (e.g., "2-4" stays "2-4")
 * Preserves hyphens between currency amounts (e.g., "£200k-£500k")
 * Converts 'gbp' back to £ symbol
 */
export function slugToText(slug: string): string {
  const decoded = decodeURIComponent(slug)
    .replace(/gbp/g, '£')  // Convert 'gbp' back to £
  
  // Use a more sophisticated replacement that preserves hyphens in ranges
  return decoded.replace(/-/g, (match, offset) => {
    const before = decoded[offset - 1]
    const after = decoded[offset + 1]
    
    // Keep hyphen if between two digits (e.g., "2-4")
    if (before && after && /\d/.test(before) && /\d/.test(after)) {
      return '-'
    }
    
    // Keep hyphen if between letters and digits (e.g., "200k-500k" or "£200k-£500k")
    // Check a few chars back for numbers or currency symbols
    const beforeContext = decoded.slice(Math.max(0, offset - 5), offset)
    const afterContext = decoded.slice(offset + 1, offset + 6)
    if (/[\d£kmKM]/.test(beforeContext) && /[\d£kmKM]/.test(afterContext)) {
      return '-'
    }
    
    return ' '  // Convert to space otherwise
  })
}

/**
 * Convert slug to title case (e.g., "cardiff-bay" -> "Cardiff Bay")
 */
export function slugToTitleCase(slug: string): string {
  return slugToText(slug).replace(/\b\w/g, l => l.toUpperCase())
}

/**
 * Get display text for radius (e.g., 5 -> "within 5 miles of", 0 -> "in")
 */
export function getRadiusDisplayText(radiusSlug: string): string {
  if (radiusSlug === 'this-area-only') return 'in'
  const match = radiusSlug?.match(/^(\d+(?:-\d+)?)-miles?$/)
  return match?.[1] ? `within ${match[1].replace('-', '.')} miles of` : 'near'
}
