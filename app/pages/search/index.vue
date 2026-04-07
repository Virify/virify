<template>
  <div class="p-dock" :class="{
    'p-dock--has-grid': showGrid
  }">
    <OrganismsPaneSlider @boundary-exceeded="updateViewMode" :left-slot="showGrid" :right-slot="showMap" :class="{
      '| container': showGrid
    }">
      <template #left v-if="showGrid">
        <OrganismsResults v-if="isLoading || results.length" :results :is-loading="isLoading"
          :query-analysis="searchState?.queryAnalysis" :location="searchState?.location" :radius="searchState?.radius"
          @open-popover="handleOpenPopover" />
        <MoleculesAiSearchNoResults v-else :last-search-query="searchState?.query || 'No previous search'" />
      </template>

      <!-- Use v-show to keep map in DOM once initialized, avoiding expensive re-initialization -->
      <template #right>
        <LazyOrganismsAiSearchMapView v-if="mapHasBeenShown" v-show="showMap" class="p-dock__map" :results
          :is-searching="isLoading" :has-searched="resultsAreCurrentForLocation" :radius :location />
      </template>
    </OrganismsPaneSlider>

    <MoleculesAiSearchLoading v-if="isLoading" class="p-dock__loading" />

    <OrganismsDock ref="dockRef" />
  </div>
</template>

<script setup lang="ts">
import type { SortOrder } from '~/composables/useSearchState'

/**
 * Search Results Page
 * Displays results from either traditional or AI-enhanced search
 * Results are stored in searchState composable
 */

const {
  isLoading,
  searchState,
  setResults,
  setViewMode,
  setSortOrder,
  setSearchPending,
  setQueryAnalysis
} = useSearchState()

const { trackSearch } = useAnalyticsTracking()

/**
 * Re-run search on page load if we have search metadata but no results
 * This handles page refreshes and back/forward navigation
 */
onMounted(async () => {
  const state = searchState.value

  // If we have results already, nothing to do
  if (state.results && state.results.length > 0) return

  // If we don't have a location or search type, can't re-run search
  if (!state.location || !state.searchType) return

  // Re-run the search based on type
  try {
    setSearchPending(true)

    if (state.searchType === 'traditional') {
      // Use preserved form data if available
      const formData = (state as any).traditionalSearchForm

      if (!formData) {
        navigateTo('/')
        return
      }

      const body = {
        ...formData,
        location: state.location,
        radius: state.radius,
      }

      const response = await $fetch<ListingWithFullProperty[]>('/api/search/traditional', {
        method: 'POST',
        body
      })

      if (response) {
        setResults(response)
      }
    } else if (state.searchType === 'ai' && state.query) {
      // Re-run AI search
      const body = {
        query: state.query,
        listingType: state.listingType === 'sale' ? 'sale' : state.listingType === 'rent' ? 'rent' : 'all',
        location: state.location,
        radius: state.radius ?? 5,
      }

      const response = await $fetch('/api/search/rag', {
        method: 'POST',
        body
      })

      if (response) {
        setResults(response.results || [])
        if (response.queryAnalysis) {
          setQueryAnalysis(response.queryAnalysis)
        }
        trackSearch({
          listingType: response.effectiveListingType ?? body.listingType,
          query: body.query,
          location: state.location as GeocodingFeature,
          radius: body.radius,
          resultCount: response.results?.length ?? 0,
        })
      }
    }
  } catch (error) {
    console.error('Failed to restore search:', error)
  } finally {
    setSearchPending(false)
  }
})

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
const resultsAreCurrentForLocation = computed(() => {
  return searchState.value?.hasSearched || false
})

/**
 *  Handle searches
 */
const location = computed(() => asObject(searchState.value).location)
const radius = computed(() => asObject(searchState.value).radius)
const sortBy = computed(() => asObject(searchState.value).sortBy)
const viewMode = computed(() => asObject(searchState.value).viewMode)

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
 * SEO Meta
 */
const locationName = computed(() => {
  const loc = location.value
  if (!loc) return 'UK'
  return loc.place_name_en || loc.place_name || loc.text || 'UK'
})

const searchQueryText = computed(() => {
  return searchState.value?.query || 'properties'
})

const seoTitle = computed(() => {
  return `${searchQueryText.value} in ${locationName.value} | Virify Property Search`
})

const seoDescription = computed(() => {
  const loc = locationName.value
  const query = searchQueryText.value
  return `Find ${query} in ${loc}. Search properties for sale and rent with Virify's AI-powered property search. Compare prices, view photos, and find your perfect home.`
})

useHead({
  title: seoTitle,
})

useSeoMeta({
  description: seoDescription,
  ogType: 'website',
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogSiteName: 'Virify',
  ogImage: '/img/og-search.jpg',
  ogLocale: 'en_GB',
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: '/img/og-search.jpg',
  robots: 'index, follow',
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
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    inset: 0;
    z-index: 8;
    background: radial-gradient(var(--background-200), transparent);
    gap: var(--size-16);

    .m-ai-search-loading__content {
      max-width: 24ch;
      line-height: var(--lineheight-sm);
      font-size: var(--font-lg);
    }
  }
}
</style>
