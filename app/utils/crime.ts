import { calculateDistance } from "#imports"

/**
 * Gets the last available month for crime data (2 months behind current date)
 * @returns Date string in YYYY-MM format
 */
export function getLastAvailableMonth(): string {
  const now = new Date()
  now.setMonth(now.getMonth() - 2)
  return now.toISOString().slice(0, 7)
}

/**
 * Converts crime score level to human-readable text
 * @param level - Crime level (very-low, low, medium, high, very-high)
 * @returns Human-readable crime level description
 */
export function getScoreLevelText(level: string): string {
  const levels = {
    'very-low': 'Very Low Crime',
    'low': 'Low Crime',
    'medium': 'Moderate Crime',
    'high': 'High Crime',
    'very-high': 'Very High Crime'
  }
  return levels[level as keyof typeof levels] || 'Unknown'
}

/**
 * Filters crime incidents by radius around a location
 * @param crimes - Array of crime incidents
 * @param lat - Center point latitude
 * @param lon - Center point longitude
 * @param radiusMeters - Maximum distance in meters
 * @returns Filtered crimes within the radius
 */
export function filterCrimesByRadius(crimes: CrimeIncident[], lat: number, lon: number, radiusMeters: number): CrimeIncident[] {
  return crimes.filter((crime) => {
    if (!crime.location?.latitude || !crime.location?.longitude) return false
    const distance = calculateDistance(lat, lon, parseFloat(crime.location.latitude), parseFloat(crime.location.longitude))
    return distance <= radiusMeters
  })
}
/**
 * Calculates crime score based on crime incidents and their weighted severity
 * @param crimes - Array of crime incidents
 * @returns Object with score (0-100), level, and description
 */
export function calculateCrimeScore(crimes: CrimeIncident[]): CrimeScore {
  if (!crimes.length) return { score: 0, level: "very-low", description: "No recent crime data available" }

  const crimeWeights: Record<string, number> = {
    "violent-crime": 3,
    robbery: 4,
    burglary: 3,
    "vehicle-crime": 2,
    "criminal-damage-arson": 2,
    drugs: 2,
    "possession-of-weapons": 4,
    "public-order": 2,
    "theft-from-the-person": 3,
    shoplifting: 1,
    "other-theft": 1,
    "bicycle-theft": 1,
    "anti-social-behaviour": 1,
  }

  const totalScore = crimes.reduce((sum, crime) => {
    return sum + (crimeWeights[crime.category] || 1)
  }, 0)

  const normalizedScore = Math.min(100, (totalScore / crimes.length) * 10)

  let level: string
  let description: string

  if (normalizedScore >= 80) {
    level = "very-high"
    description = "Very high crime area - exercise significant caution"
  } else if (normalizedScore >= 60) {
    level = "high"
    description = "High crime area - be aware of surroundings"
  } else if (normalizedScore >= 40) {
    level = "medium"
    description = "Moderate crime levels - typical urban area"
  } else if (normalizedScore >= 20) {
    level = "low"
    description = "Low crime area - relatively safe"
  } else {
    level = "very-low"
    description = "Very low crime area - generally very safe"
  }

  return { score: Math.round(normalizedScore), level, description }
}

/**
 * Groups crimes by category and sorts by frequency
 * @param crimes - Array of crime incidents
 * @returns Array of grouped crimes sorted by count (highest first)
 */
export function groupCrimesByCategory(crimes: CrimeIncident[]): CrimeCategoryGroup[] {
  const grouped = crimes.reduce((acc, crime) => {
    const category = crime.category
    if (!acc[category]) {
      acc[category] = {
        category,
        count: 0,
        incidents: [],
      }
    }
    acc[category].count++
    acc[category].incidents.push(crime)
    return acc
  }, {} as Record<string, CrimeCategoryGroup>)

  return Object.values(grouped).sort((a, b) => b.count - a.count)
}

/**
 * Gets recent crimes sorted by date
 * @param crimes - Array of crime incidents
 * @param limit - Maximum number of crimes to return (default: 10)
 * @returns Array of recent crimes
 */
export function getRecentCrimes(crimes: CrimeIncident[], limit: number = 10): CrimeIncident[] {
  return crimes
    .sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime())
    .slice(0, limit)
}

/**
 * Gets maximum category count for visualization scaling
 * @param categories - Array of grouped crime categories
 * @returns Maximum count or 1 if no categories
 */
export function getMaxCategoryCount(categories: CrimeCategoryGroup[]): number {
  if (!categories?.length) return 1
  return Math.max(...categories.map(cat => cat.count), 1)
}

/**
 * Creates overall crime score card data
 * @param crimeScore - Crime score object with score, level, description
 * @param getScoreLevelText - Function to format score level text
 * @returns Card data object or null
 */
export function createOverallScoreCard(crimeScore: CrimeScore | null, getScoreLevelText: (level: string) => string): StatCard | null {
  if (!crimeScore) return null
  
  return {
    title: 'Crime Score',
    value: crimeScore.score.toString(),
    description: getScoreLevelText(crimeScore.level),
    icon: 'listings/risk'
  }
}

/**
 * Creates total incidents card data
 * @param categories - Array of grouped crime categories
 * @param dataYear - Year of the data
 * @returns Card data object or null
 */
export function createTotalIncidentsCard(categories: CrimeCategoryGroup[], dataYear: number): StatCard | null {
  if (!categories?.length) return null
  
  const totalIncidents = categories.reduce((sum, cat) => sum + cat.count, 0)
  return {
    title: 'Total Incidents',
    value: totalIncidents.toString(),
    description: `Reported in ${dataYear}`,
    icon: 'listings/risk'
  }
}

/**
 * Creates most common crime card data
 * @param categories - Array of grouped crime categories (sorted by frequency)
 * @param formatCategoryName - Function to format category names
 * @returns Card data object or null
 */
export function createMostCommonCrimeCard(categories: CrimeCategoryGroup[], formatCategoryName: (category: string) => string): StatCard | null {
  if (!categories?.length) return null

  const topCategory = categories[0]
  if (!topCategory) return null
  
  return {
    title: 'Most Common',
    value: formatCategoryName(topCategory.category),
    description: `${topCategory.count} incidents`,
    icon: 'listings/risk'
  }
}

/**
 * Creates safety level card data
 * @param crimeScore - Crime score object with level and description
 * @returns Card data object or null
 */
export function createSafetyLevelCard(crimeScore: CrimeScore | null): StatCard | null {
  if (!crimeScore) return null

  const safetyDescriptions = {
    'very-low': 'Very Safe Area',
    'low': 'Generally Safe',
    'medium': 'Average Safety',
    'high': 'Caution Advised',
    'very-high': 'High Risk Area'
  }

  return {
    title: 'Safety Level',
    value: safetyDescriptions[crimeScore.level as keyof typeof safetyDescriptions] || 'Unknown',
    description: crimeScore.description,
    icon: 'listings/risk'
  }
}

/**
 * Formats crime category name from kebab-case to Title Case
 * @param category - Crime category in kebab-case format
 * @returns Formatted category name in Title Case
 */
export function formatCategoryName(category: string): string {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}