/**
 * Composable for fetching and analyzing historical flood risk data
 * Uses UK Environment Agency APIs to assess flood risk based on historical events
 */
export const useFloodRisk = () => {
  const historicalFloodEvents = ref<HistoricalFloodEvent[]>([])
  const floodStations = ref<FloodStation[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Fetches historical flood data and monitoring stations for a location
   * @param lat - Latitude coordinate
   * @param lon - Longitude coordinate
   * @param radius - Search radius in meters (default: 16093m = 10 miles)
   */
  const fetchFloodData = async (lat: number, lon: number, radius: number = 16093) => {
    loading.value = true
    error.value = null

    try {
      // Calculate bounding box for the WFS query (radius in meters: 16093m = 10 miles)
      const bbox = createBoundingBox(lat, lon, radius)
      
      // Get historical flood events within the past 10 years
      const cutoffDate = createFloodDataCutoffDate()

      const [stationsResponse, historicalResponse] = await Promise.all([
        // Monitoring stations in the area
        $fetch<StationApiResponse>(`https://environment.data.gov.uk/flood-monitoring/id/stations?lat=${lat}&long=${lon}&dist=${radius}`).catch(() => ({ items: [] })),
        // Historical flood outlines with actual dates and details
        $fetch<any>(`https://environment.data.gov.uk/geoservices/datasets/8c75e700-d465-11e4-8b5b-f0def148f590/wfs?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAME=Recorded_Flood_Outlines&outputFormat=GEOJSON&BBOX=${bbox}&COUNT=50`).catch(() => ({ features: [] }))
      ])

      // Filter flood events to last 10 years and process the data
      const allFloodEvents = historicalResponse.features || []
      const recentFloodEvents = processFloodEvents(allFloodEvents, cutoffDate)

      historicalFloodEvents.value = recentFloodEvents
      floodStations.value = stationsResponse.items || []
    } catch (err) {
      error.value = 'Failed to fetch flood data'
      console.error('Flood data fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  const floodRiskLevel = computed(() => {
    return calculateFloodRiskLevel(historicalFloodEvents.value)
  })

  const floodEventsSummary = computed(() => {
    return createFloodEventsSummary(historicalFloodEvents.value)
  })



  return {
    historicalFloodEvents: readonly(historicalFloodEvents),
    floodStations: readonly(floodStations),
    loading: readonly(loading),
    error: readonly(error),
    floodRiskLevel,
    floodEventsSummary,
    fetchFloodData,
    getRiskLevelText,
    getRiskDescription
  }
}