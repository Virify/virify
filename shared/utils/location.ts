/**
 * Get a short but unique location name for display
 * e.g. "Cardiff, City of Cardiff" instead of "Cardiff, Wales, United Kingdom"
 * For postcodes, includes more address detail: "CF10 3NQ, Castle Street, Cardiff"
 */
export function getShortLocationName(location: {
  text?: string
  place_name?: string
  place_name_en?: string
}): string {
  const fullName = location.place_name_en || location.place_name || ''
  const parts = fullName.split(', ')
  const text = location.text || ''
  
  // Check if this is a postcode (UK postcode pattern)
  const isPostcode = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(text)
  
  // Remove country/region names from the end
  const filteredParts = parts.filter(part => 
    !['United Kingdom', 'UK', 'England', 'Scotland', 'Wales', 'Northern Ireland'].includes(part)
  )
  
  if (isPostcode && filteredParts.length >= 2) {
    // For postcodes: show more detail "CF10 3NQ, Castle Street, Cardiff"
    return filteredParts.slice(0, 3).join(', ')
  }
  
  // For other locations: take first 2 parts for context
  return filteredParts.slice(0, 2).join(', ') || text || fullName
}
