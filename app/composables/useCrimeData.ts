/**
 * Composable for fetching and managing crime data from the UK Police API
 * Provides crime statistics, safety scores, and categorized crime data
 */
export const useCrimeData = () => {
  const crimeData = ref<CrimeIncident[]>([]);
  const crimeCategories = ref<CrimeCategory[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentDataYear = ref<number>(new Date().getFullYear());

  /**
   * Fetches crime data for a specific location and date
   * @param lat - Latitude coordinate
   * @param lon - Longitude coordinate
   * @param date - Optional date string (YYYY-MM format)
   */
  const fetchCrimeData = async (lat: number, lon: number, date?: string) => {
    loading.value = true;
    error.value = null;

    try {
      const dateParam = date || getLastAvailableMonth();
      const [crimesResponse, categoriesResponse] = await Promise.all([
        $fetch<CrimeIncident[]>(`https://data.police.uk/api/crimes-at-location?lat=${lat}&lng=${lon}&date=${dateParam}`),
        $fetch<CrimeCategory[]>("https://data.police.uk/api/crime-categories"),
      ]);

      crimeData.value = crimesResponse || [];
      crimeCategories.value = categoriesResponse || [];
    } catch (err) {
      error.value = "Failed to fetch crime data";
      console.error("Crime data fetch error:", err);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetches crime data within a specified radius of a location
   * @param lat - Latitude coordinate
   * @param lon - Longitude coordinate
   * @param radiusMeters - Search radius in meters (default: 1000m)
   */
  const fetchAreaCrimeData = async (lat: number, lon: number, radiusMeters: number = 1000) => {
    loading.value = true;
    error.value = null;

    try {
      const currentYear = new Date().getFullYear();

      // Try current year first, then fall back to previous years if no data
      const yearsToTry = [currentYear, currentYear - 1, currentYear - 2];
      let response: CrimeIncident[] = [];
      let successfulYear = currentYear;

      for (const year of yearsToTry) {
        try {
          const testResponse = await $fetch<CrimeIncident[]>(`https://data.police.uk/api/crimes-street/all-crime?lat=${lat}&lng=${lon}&date=${year}-01`);
          if (testResponse && testResponse.length > 0) {
            response = testResponse;
            successfulYear = year;
            break;
          }
        } catch (yearErr) {
          console.log(`No data available for ${year}, trying previous year...`);
          continue;
        }
      }

      const filteredCrimes = filterCrimesByRadius(response || [], lat, lon, radiusMeters)

      crimeData.value = filteredCrimes;
      // Store the year we got data for
      currentDataYear.value = successfulYear;

      const categoriesResponse = await $fetch<CrimeCategory[]>("https://data.police.uk/api/crime-categories").catch(() => []);
      crimeCategories.value = categoriesResponse || [];
    } catch (err) {
      error.value = "Failed to fetch area crime data";
      console.error("Area crime data fetch error:", err);
    } finally {
      loading.value = false;
    }
  };

  const crimeScore = computed(() => {
    return calculateCrimeScore(crimeData.value)
  })

  const crimesByCategory = computed(() => {
    return groupCrimesByCategory(crimeData.value)
  })

  const recentCrimes = computed(() => {
    return getRecentCrimes(crimeData.value, 10)
  })

  const dataYear = computed(() => {
    return currentDataYear.value
  })



  // Computed properties for StatsCards
  const maxCategoryCount = computed(() => {
    return getMaxCategoryCount(crimesByCategory.value)
  })

  const overallScoreCard = computed(() => {
    return createOverallScoreCard(crimeScore.value, getScoreLevelText)
  })

  const totalIncidentsCard = computed(() => {
    return createTotalIncidentsCard(crimesByCategory.value, dataYear.value)
  })

  const mostCommonCrimeCard = computed(() => {
    return createMostCommonCrimeCard(crimesByCategory.value, formatCategoryName)
  })

  const safetyLevelCard = computed(() => {
    return createSafetyLevelCard(crimeScore.value)
  })

  // Info text constants
  const crimeInfoText = {
    overallScore: 'Crime Score: A numerical rating from 1-10 based on local crime data, where 1 is very low crime and 10 is very high crime. This score helps you quickly understand the relative safety of the area.',
    totalIncidents: 'Total Incidents: The total number of reported crimes within a 5-mile radius of this property for the current data year. This includes all crime types recorded by local police.',
    mostCommon: 'Most Common Crime: The type of crime that occurs most frequently in this area. Understanding the most common crime type can help you take appropriate precautions.',
    safetyLevel: 'Safety Level: An assessment of the overall safety of the area based on crime statistics. This gives you a quick understanding of what to expect in terms of personal and property safety.'
  }

  return {
    crimeData: readonly(crimeData),
    crimeCategories: readonly(crimeCategories),
    loading: readonly(loading),
    error: readonly(error),
    crimeScore,
    crimesByCategory,
    recentCrimes,
    dataYear,
    fetchCrimeData,
    fetchAreaCrimeData,
    // StatsCard computed properties
    maxCategoryCount,
    overallScoreCard,
    totalIncidentsCard,
    mostCommonCrimeCard,
    safetyLevelCard,
    // Info text
    crimeInfoText,
  };
};

