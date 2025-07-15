export function useAmenities() {
  const { findNearbyAmenities } = useMapSearch()

  const amenities = ref({
    schools: [] as Array<{ name: string; distance: number; type: string }>,
    hospitals: [] as Array<{ name: string; distance: number; type: string }>,
    shops: [] as Array<{ name: string; distance: number; type: string }>
  })

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Fetch amenities for a property - checks cache first, then fetches if needed
   */
  async function fetchAmenities(propertyId: number, lat: number, lon: number, radius: number = 5000) {
    if (isLoading.value) return
    
    isLoading.value = true
    error.value = null

    try {
      // Step 1: FIRST - Check if amenities already exist in database
      const existingAmenities = await checkExistingAmenities(propertyId)
      
      if (existingAmenities) {
        // Use existing amenities from database (no API call needed)
        amenities.value = existingAmenities
        console.log('Using cached amenities from database')
        return
      }
      
      // Step 2: ONLY if no amenities exist - fetch from MapTiler API
      console.log('No cached amenities found, fetching from MapTiler API')
      const nearbyAmenities = await findNearbyAmenities(lat, lon, radius)
      amenities.value = nearbyAmenities
      
      // Step 3: ONLY after fetching - save to database for future use
      await saveAmenitiesToDatabase(propertyId, nearbyAmenities)
      console.log('Amenities saved to database for future use')
      
    } catch (err) {
      error.value = 'Error fetching nearby amenities'
      console.error('Error fetching nearby amenities:', err)
    } finally {
      isLoading.value = false
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
  async function saveAmenitiesToDatabase(propertyId: number, amenitiesData: typeof amenities.value) {
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
        ...amenitiesData.shops.map(shop => ({
          type: 'SHOPPING_ENTERTAINMENT' as const,
          subtype: 'SHOP' as const,
          name: shop.name,
          distanceM: shop.distance,
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
    amenities.value = {
      schools: [],
      hospitals: [],
      shops: []
    }
    error.value = null
  }

  return {
    amenities: readonly(amenities),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchAmenities,
    formatDistance,
    resetAmenities
  }
}