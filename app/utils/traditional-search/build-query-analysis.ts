/**
 * Build a QueryAnalysis object from traditional search form data
 * This creates the filter badges shown at the top of search results
 */
export function buildQueryAnalysisFromFormData(data: TraditionalSearchData): QueryAnalysis {
  const usedTerms: string[] = []

  // Listing type
  if (data.isSale) {
    usedTerms.push('Properties To Buy')
  } else {
    usedTerms.push('Properties To Rent')
  }

  // Price range
  const [minPrice, maxPrice] = data.price
  if (minPrice > 0 || maxPrice > 0) {
    const formatted = formatPriceRange(minPrice, maxPrice)
    usedTerms.push(formatted)
  }

  // Bedrooms
  if (data.minBeds > 0 || data.maxBeds < 9) {
    usedTerms.push(formatBedroomRange(data.minBeds, data.maxBeds))
  }

  // Bathrooms  
  if (data.minBathrooms > 0 || data.maxBathrooms < 6) {
    usedTerms.push(`${data.minBathrooms}-${data.maxBathrooms} Bathrooms`)
  }

  // Property types
  if (data.propertyTypes) {
    const types = Object.entries(data.propertyTypes)
      .filter(([_, subtypes]) => subtypes.length > 0)
      .map(([type]) => type)
    
    if (types.length > 0 && types.length < 8) {
      usedTerms.push(...types)
    }
  }

  // Additional features
  const activeFeatures = Object.entries(data.additionalFeatures || {})
    .filter(([_, enabled]) => enabled)
    .map(([key]) => formatFeatureName(key))
  
  usedTerms.push(...activeFeatures)

  // Size
  const { minSize, maxSize, sizeUnit } = data
  const unit = sizeUnit === 'sqft' ? 'sqft' : 'sqmtr'

  if (minSize && maxSize) {
    usedTerms.push(`${minSize}-${maxSize} ${unit}`)
  } else if (minSize) {
    usedTerms.push(`${minSize}+ ${unit}`)
  } else if (maxSize) {
    usedTerms.push(`Up to ${maxSize} ${unit}`)
  }

  // Sale includes
  if (data.isSale) {
    const saleFeatures = Object.entries(data.saleIncludes || {})
      .filter(([_, enabled]) => enabled)
      .map(([key]) => formatFeatureName(key))
    
    usedTerms.push(...saleFeatures)
  }

  // Rent includes
  if (!data.isSale) {
    const rentFeatures = Object.entries(data.rentIncludes || {})
      .filter(([_, enabled]) => enabled)
      .map(([key]) => formatFeatureName(key))
    
    usedTerms.push(...rentFeatures)
  }

  return {
    usedTerms,
    ignoredTerms: []
  }
}

function formatPriceRange(min: number, max: number): string {
  if (min > 0 && max > 0) {
    return `£${formatNumber(min)}-£${formatNumber(max)}`
  }
  if (min > 0) {
    return `£${formatNumber(min)}+`
  }
  if (max > 0) {
    return `Up to £${formatNumber(max)}`
  }
  return ''
}

function formatBedroomRange(min: number, max: number): string {
  if (min === 0 && max === 9) {
    return 'Any Bedrooms'
  }
  if (min === max) {
    return `${min} Bedrooms`
  }
  if (max === 9) {
    return `${min}+ Bedrooms`
  }
  return `${min}-${max} Bedrooms`
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 0) + 'K'
  }
  return num.toString()
}

function formatFeatureName(key: string): string {
  const labels: Record<string, string> = {
    'sold-stc': 'Sold STC',
    'chain-free': 'Chain Free',
    'freehold-only': 'Freehold Only',
    'let-agreed': 'Let Agreed',
    'short-term-lets': 'Short-term Lets',
    'long-term-lets': 'Long-term Lets',
    'off-street-parking': 'Off-street Parking',
    'disabled-access': 'Disability Access',
    'ev-charging': 'EV Charging',
    'full-fibre': 'Full Fibre Broadband',
  }
  return labels[key] ?? key
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
