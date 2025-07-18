import { useStorage } from '@vueuse/core'
  // Collapsed state for amenities categories (persisted)
  const collapsedCategories = useStorage<Record<string, boolean>>('amenities-collapsed', {
    schools: false,
    hospitals: false,
    train_stations: false
  })

  function isCategoryCollapsed(category: string) {
    return !!collapsedCategories.value[category]
  }

  function setCategoryCollapsed(category: string, collapsed: boolean) {
    collapsedCategories.value[category] = collapsed
  }

// Global state for amenities (singleton pattern)
const globalAmenities = ref({
  schools: [] as Array<{ name: string; distance: number; type: string }>,
  hospitals: [] as Array<{ name: string; distance: number; type: string }>,
  train_stations: [] as Array<{ name: string; distance: number; type: string }>
})

const globalIsLoading = ref(false)
const globalError = ref<string | null>(null)

export function useAmenities() {
  const { findNearbyAmenities } = useMapSearch()

  /**
   * Fetch amenities for a property - checks cache first, then fetches if needed
   */
  async function fetchAmenities(propertyId: number, lat: number, lon: number, radius: number = 5000) {
    if (globalIsLoading.value) return
    
    globalIsLoading.value = true
    globalError.value = null

    try {
      // Step 1: FIRST - Check if amenities already exist in database
      const existingAmenities = await checkExistingAmenities(propertyId)
      
      if (existingAmenities) {
        // Group amenities from flat array into the expected object structure
        const groupedAmenities = {
          schools: existingAmenities
            .filter((a: any) => a.type === 'EDUCATION' && a.subtype === 'SCHOOL')
            .map((a: any) => ({
              name: a.name,
              distance: a.distanceM,
              type: 'SCHOOL'
            })),
          hospitals: existingAmenities
            .filter((a: any) => a.type === 'HEALTHCARE' && a.subtype === 'HOSPITAL')
            .map((a: any) => ({
              name: a.name,
              distance: a.distanceM,
              type: 'HOSPITAL'
            })),
          train_stations: existingAmenities
            .filter((a: any) => a.type === 'TRANSPORT' && a.subtype === 'TRAIN_STATION')
            .map((a: any) => ({
              name: a.name,
              distance: a.distanceM,
              type: 'TRAIN_STATION'
            }))
        }
        globalAmenities.value = groupedAmenities
        console.log('Using cached amenities from database')
        return
      }
      
      // Step 2: ONLY if no amenities exist - fetch from MapTiler API
      const nearbyAmenities = await findNearbyAmenities(lat, lon, radius)
      globalAmenities.value = nearbyAmenities
      
      // Step 3: ONLY after fetching - save to database for future use
      await saveAmenitiesToDatabase(propertyId, globalAmenities.value)
      
    } catch (err) {
      console.error('Error fetching nearby amenities:', err)
    } finally {
      globalIsLoading.value = false
    }
  }

  /**
   * Check if amenities exist in database and return them
   */
  async function checkExistingAmenities(propertyId: number) {
    try {
      const response = await $fetch(`/api/amenities/${propertyId}`)
      if (response.exists && response.amenities) {
        return response.amenities
      }
      return null
    } catch (err) {
      // 404 or other error means no amenities exist
      return null
    }
  }

  /**
   * Save amenities to database
   */
  async function saveAmenitiesToDatabase(propertyId: number, amenitiesData: typeof globalAmenities.value) {
    try {
      const amenitiesArray = [
        ...amenitiesData.schools.map(school => ({
          type: 'EDUCATION' as const,
          subtype: 'SCHOOL' as const,
          name: school.name,
          distanceM: school.distance,
          description: null,
          location: null
        })),
        ...amenitiesData.hospitals.map(hospital => ({
          type: 'HEALTHCARE' as const,
          subtype: 'HOSPITAL' as const,
          name: hospital.name,
          distanceM: hospital.distance,
          description: null,
          location: null
        })),
        ...amenitiesData.train_stations.map(station => ({
          type: 'TRANSPORT' as const,
          subtype: 'TRAIN_STATION' as const,
          name: station.name,
          distanceM: station.distance,
          description: null,
          location: null
        }))
      ]
      
      await $fetch(`/api/amenities/${propertyId}`, {
        method: 'POST',
        body: { amenities: amenitiesArray }
      })
    } catch (err) {
      console.error('Error saving amenities to database:', err)
    }
  }

  /**
   * Format distance from meters to miles
   */
  function formatDistance(meters: number): string {
    const miles = meters / 1609.34 // Convert meters to miles
    return `${miles.toFixed(1)} miles`
  }

  /**
   * Reset amenities state
   */
  function resetAmenities() {
    globalAmenities.value = {
      schools: [],
      hospitals: [],
      train_stations: []
    }
    globalError.value = null
  }

  return {
    amenities: readonly(globalAmenities),
    isLoading: readonly(globalIsLoading),
    error: readonly(globalError),
    fetchAmenities,
    formatDistance,
    resetAmenities,
    isCategoryCollapsed,
    setCategoryCollapsed
  }
}