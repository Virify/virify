<template>
  <div class="p-dock" :class="{
    'p-dock--has-grid': showGrid
  }">
    <OrganismsPaneSlider @boundary-exceeded="updateViewMode" :left-slot="showGrid" :right-slot="showMap" :class="{
      '| container': showGrid
    }">
      <template #left v-if="showGrid">
        <OrganismsResults v-if="isInitializing || isLoading || results.length" :results
          :is-loading="isInitializing || isLoading" :query-analysis="searchState?.queryAnalysis"
          :location="searchState?.location" :radius="searchState?.radius" @open-popover="handleOpenPopover" />
        <MoleculesAiSearchNoResults v-else :last-search-query="searchState?.query || 'No previous search'" />
      </template>

      <!-- Use v-show to keep map in DOM once initialized, avoiding expensive re-initialization -->
      <template #right>
        <LazyOrganismsAiSearchMapView 
          v-if="mapHasBeenShown" 
          v-show="showMap" 
          class="p-dock__map" 
          :results 
          :is-searching="isLoading" 
          :has-searched="resultsAreCurrentForLocation"
          :radius 
          :location 
        />
      </template>
    </OrganismsPaneSlider>

    <MoleculesAiSearchLoading v-if="isLoading" class="p-dock__loading" />

    <OrganismsDock ref="dockRef" />
  </div>
</template>

<script setup lang="ts">
import type { SortOrder } from '~/composables/useSearchState'

const route = useRoute()

const locationName = computed(() => {
  const slug = route.params.location as string
  if (!slug) return 'UK'
  return slugToTitleCase(slug)
})

const radiusText = computed(() => {
  const slug = route.params.radius as string
  return getRadiusDisplayText(slug)
})

const searchQueryText = computed(() => {
  const prompt = route.params.prompt
  const slug = Array.isArray(prompt) ? prompt.join(' ') : prompt as string
  if (!slug) return 'properties'
  return slugToText(slug)
})

const seoTitle = computed(() => {
  return `${searchQueryText.value} ${radiusText.value} ${locationName.value} | Virify Property Search`
})

const seoDescription = computed(() => {
  const loc = locationName.value
  const query = searchQueryText.value
  return `Find ${query} ${radiusText.value} ${loc}. Search properties for sale and rent with Virify's AI-powered property search. Compare prices, view photos, and find your perfect home.`
})

const canonicalUrl = computed(() => {
  return `https://virify.co.uk${route.path}`
})

// Page meta
useHead({
  title: seoTitle,
  link: [
    { rel: 'canonical', href: canonicalUrl }
  ]
})

useSeoMeta({
  description: seoDescription,
  
  // Open Graph
  ogType: 'website',
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogUrl: canonicalUrl,
  ogSiteName: 'Virify',
  ogImage: '/img/og-search.jpg',
  ogLocale: 'en_GB',
  
  // Twitter
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: '/img/og-search.jpg',
  
  // Additional SEO
  robots: 'index, follow',
})

const {
  isLoading,
  searchState,
  setResults,
  setQueryAnalysis,
  setSearchPending,
  setViewMode,
  setSortOrder,
  setLocation,
  setLocationRadius,
  setQuery
} = useSearchState()

/**
 * Reference to the dock component
 */
const dockRef = ref<{ showPopover: (type: 'location' | 'filters') => void } | null>(null)

/**
 * Handle opening the dock popover
 */
function handleOpenPopover(type: 'location' | 'filters') {
  dockRef.value?.showPopover(type)
}

/**
 *  Update layout
 */
function updateViewMode(viewMode: string) {
  setViewMode(viewMode === 'left' ? 'map' : 'grid')
}

const showGrid = computed(() => {
  const { viewMode } = asObject(searchState.value)
  return viewMode === 'grid' || viewMode === 'split'
})

const showMap = computed(() => {
  const { viewMode } = asObject(searchState.value)
  return viewMode === 'map' || viewMode === 'split'
})

// Track if the map has ever been shown to avoid re-initializing it
const mapHasBeenShown = ref(false)
watch(showMap, (value) => {
  if (value) mapHasBeenShown.value = true
}, { immediate: true })

// Track if results are current for the displayed location
// When location changes, results become stale until a new search is performed
const resultsAreCurrentForLocation = ref(false)

/**
 *  Handle searches
 */
const location = computed(() => asObject(searchState.value).location)
const radius = computed(() => asObject(searchState.value).radius)
const sortBy = computed(() => asObject(searchState.value).sortBy)
const viewMode = computed(() => asObject(searchState.value).viewMode)
const query = computed(() => asObject(searchState.value).query)

// When location or radius changes, mark results as stale (not current for this search criteria)
watch([location, radius], () => {
  resultsAreCurrentForLocation.value = false
})

const { aiSearch } = useAi()

/**
 * Trigger search - called on initial load only
 */
async function triggerSearch() {
  const { listingType: lt,location: loc, query: q, radius: r } = asObject(searchState.value)

  if (!loc || !q) return

  // Clear previous results and show loading state
  setResults([])
  setSearchPending(true)

  try {
    const { queryAnalysis, results } = await aiSearch(lt, loc, r, q, 1)

    if (queryAnalysis) setQueryAnalysis(queryAnalysis)
    setResults(results)
    
    // Mark results as current for this location
    resultsAreCurrentForLocation.value = true
  } finally {
    setSearchPending(false)
  }
}

watch(sortBy, (newValue) => {
  setSortOrder(newValue as SortOrder)
})

watch(viewMode, (layout) => {
  if (layout !== 'map') return
  window.scrollTo({ top: 0, behavior: 'instant' })
})

/**
 *  Ensure missing results do not break the map
 */
const results = computed((): ListingCardData[] => {
  const { results } = asObject(searchState.value)
  if (!Array.isArray(results)) return []
  // Filter out any results with null properties and properly type as ListingCardData
  return results.filter((r): r is ListingCardData => r.property !== null)
})

/**
 * Structured data for search results (SEO)
 */
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SearchResultsPage',
        'name': seoTitle.value,
        'description': seoDescription.value,
        'url': canonicalUrl.value,
        'mainEntity': {
          '@type': 'ItemList',
          'numberOfItems': results.value.length,
          'itemListElement': results.value.slice(0, 10).map((result: any, index: number) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'item': {
              '@type': 'RealEstateListing',
              'name': result.property?.address?.street || 'Property',
              'url': `https://virify.co.uk/listing/${result.id}`
            }
          }))
        }
      }))
    }
  ]
})

/**
 *  Parse URL params and geocode location
 */
const isInitializing = ref(true)

onMounted(async () => {

  // Parse URL params
  const listingType = route.params.type as string
  const locationSlug = route.params.location as string
  const radiusSlug = route.params.radius as string
  const promptSlug = Array.isArray(route.params.prompt) 
    ? route.params.prompt.join('/') 
    : route.params.prompt as string
  const locationId = route.query.lid as string | undefined

  if (!locationSlug || !radiusSlug || !promptSlug) {
    return navigateTo('/search')
  }

  // Parse radius using shared util
  const radiusValue = parseRadiusFromSlug(radiusSlug)

  // Convert prompt slug to text using shared util
  const promptText = slugToText(promptSlug)

  // Geocode the location - prefer ID lookup if available
  try {
    const { geocodeAndSelectBest, geocodeById, enhanceWithBoundaryPolygon } = useMap()
    
    // Check if we already have this location in state (preserves full name from autocomplete)
    const existingLocation = searchState.value?.location
    if (existingLocation && locationId && existingLocation.id === locationId) {
      // Location already in state with same ID - don't re-geocode as it loses the full name
      setLocationRadius(radiusValue)
      setQuery(promptText)
      await triggerSearch()
      isInitializing.value = false
      return
    }
    
    // Try to get location by ID first (precise) - includes boundaryPolygon
    let locationData = locationId 
      ? await geocodeById(locationId)
      : null
    
    // Fall back to geocoding by name if ID lookup fails
    // Need to enhance with boundary polygon for this path
    if (!locationData) {
      const baseLocation = await geocodeAndSelectBest(slugToText(locationSlug))
      locationData = baseLocation ? await enhanceWithBoundaryPolygon(baseLocation) : null
    }

    if (locationData) {
      // MapTiler's ID lookup returns truncated place names (e.g. "Cardiff" instead of "Cardiff, United Kingdom")
      // Use the URL slug to reconstruct the full name for display
      const fullLocationName = slugToTitleCase(locationSlug)
      locationData = {
        ...locationData,
        place_name_en: fullLocationName,
        place_name: fullLocationName,
      }
      
      // Set state from URL
      setLocation(locationData)
      setLocationRadius(radiusValue)
      setQuery(promptText)
      
      // Trigger the search
      await triggerSearch()
    } else {
      console.error('Location not found:', locationSlug)
    }
  } catch (error) {
    console.error('Failed to geocode location:', error)
  } finally {
    isInitializing.value = false
  }
})
</script>

<style lang="scss">
.p-dock {
  min-height: calc(100vh - var(--header-height));

  &--has-grid {
    padding: var(--size-16) 0;
  }

  &--has-grid &__map {
    position: sticky;
    top: calc(var(--header-height) + var(--size-20));
    height: calc(100vh - var(--header-height) - var(--size-32));
    border-radius: var(--border-radius-2xl);
  }

  &__map {
    width: 100%;
    overflow: hidden;
    height: calc(100vh - var(--header-height));
  }

  &__loading {
    position: fixed;
    bottom: 120px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 8;
    background: var(--background-100);
    border-radius: var(--border-radius-2xl);
    padding: var(--size-24);
    box-shadow: var(--shadow-300);
    max-width: 400px;

    @media (min-width: 768px) {
      bottom: 140px;
    }
  }
}
</style>
