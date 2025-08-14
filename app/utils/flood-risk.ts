/**
 * Creates a bounding box string for WFS queries
 * @param lat - Latitude coordinate
 * @param lon - Longitude coordinate
 * @param radius - Search radius in meters
 * @returns Bounding box string in format "minLon,minLat,maxLon,maxLat,EPSG:4326"
 */
export function createBoundingBox(lat: number, lon: number, radius: number): string {
  // Rough conversion: 1 degree ≈ 111km
  const degreeOffset = radius / 111000
  return `${lon - degreeOffset},${lat - degreeOffset},${lon + degreeOffset},${lat + degreeOffset},EPSG:4326`
}

/**
 * Creates a cutoff date for historical flood data (10 years ago)
 * @returns Date object set to 10 years ago from current date
 */
export function createFloodDataCutoffDate(): Date {
  const cutoffDate = new Date()
  cutoffDate.setFullYear(cutoffDate.getFullYear() - 10)
  return cutoffDate
}

/**
 * Converts flood risk level to human-readable text
 * @param level - Risk level (very-low, low, medium, high)
 * @returns Human-readable risk level description
 */
export function getRiskLevelText(level: string): string {
  const levels = {
    'very-low': 'Very Low Risk',
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk'
  }
  return levels[level as keyof typeof levels] || 'Unknown Risk'
}

/**
 * Gets detailed description for flood risk level
 * @param level - Risk level (very-low, low, medium, high)
 * @returns Detailed risk description based on historical data
 */
export function getRiskDescription(level: string): string {
  const descriptions = {
    'very-low': 'No recorded flood events in the past 10 years',
    low: 'Infrequent historical flooding - low probability of future events',
    medium: 'Some historical flooding - moderate risk based on past events',
    high: 'Regular historical flooding - high probability based on recent events'
  }
  return descriptions[level as keyof typeof descriptions] || 'Risk level unknown'
}

/**
 * Calculates flood risk level based on historical flood events
 * @param events - Array of historical flood events
 * @returns Risk level (very-low, low, medium, high)
 */
export function calculateFloodRiskLevel(events: HistoricalFloodEvent[]): string {
  if (!events.length) return 'low'

  // Risk assessment based on historical flood frequency and recency
  const now = new Date()
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
  const fiveYearsAgo = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate())
  
  const recentEvents = events.filter((e: HistoricalFloodEvent) => new Date(e.startDate) >= oneYearAgo)
  const moderatelyRecentEvents = events.filter((e: HistoricalFloodEvent) => new Date(e.startDate) >= fiveYearsAgo)
  
  // High risk: 2+ events in last year OR 4+ events in last 5 years
  if (recentEvents.length >= 2 || moderatelyRecentEvents.length >= 4) {
    return 'high'
  }
  
  // Medium risk: 1 event in last year OR 2-3 events in last 5 years
  if (recentEvents.length >= 1 || moderatelyRecentEvents.length >= 2) {
    return 'medium'
  }
  
  // Low risk: 1 event in last 5 years or older events only
  return events.length > 0 ? 'low' : 'very-low'
}

/**
 * Processes raw flood event features from WFS API into structured flood events
 * Filters events to last 10 years and transforms the data structure
 * @param allFloodEvents - Raw flood event features from WFS API
 * @param cutoffDate - Date to filter events from (typically 10 years ago)
 * @returns Array of processed flood events
 */
export function processFloodEvents(allFloodEvents: any[], cutoffDate: Date): HistoricalFloodEvent[] {
  return allFloodEvents
    .filter((feature: any) => {
      const startDate = feature.properties?.start_date
      if (!startDate) return false
      return new Date(startDate) >= cutoffDate
    })
    .map((feature: any) => ({
      id: feature.properties.recorded_outline_id || feature.properties.gml_id,
      startDate: feature.properties.start_date,
      endDate: feature.properties.end_date,
      floodSource: feature.properties.flood_source_type_resolved || 'unknown',
      floodCause: feature.properties.flood_cause_resolved || 'unknown',
      surfaceArea: feature.properties.surface_area || 0,
      floodTypes: {
        fluvial: feature.properties.flood_type_fluvial_resolved === 'True',
        coastal: feature.properties.flood_type_coastal_resolved === 'True',
        tidal: feature.properties.flood_type_tidal_resolved === 'True'
      },
      name: feature.properties.name || `Flood Event ${feature.properties.recorded_outline_id}`,
      comments: feature.properties.comments
    }))
}

/**
 * Creates a summary of flood events data
 * @param events - Array of historical flood events
 * @returns Flood events summary or null if no events
 */
export function createFloodEventsSummary(events: HistoricalFloodEvent[]): FloodEventsSummary | null {
  if (!events.length) return null

  const totalEvents = events.length
  const avgArea = events.reduce((sum: number, e: HistoricalFloodEvent) => sum + (e.surfaceArea || 0), 0) / totalEvents
  const floodSources = [...new Set(events.map((e: HistoricalFloodEvent) => e.floodSource))]
  const mostRecentEvent = events.reduce((latest: HistoricalFloodEvent, event: HistoricalFloodEvent) => 
    new Date(event.startDate) > new Date(latest.startDate) ? event : latest
  )

  return {
    totalEvents,
    averageFloodedArea: Math.round(avgArea),
    floodSources,
    mostRecentEvent,
    timespan: '10 years'
  }
}