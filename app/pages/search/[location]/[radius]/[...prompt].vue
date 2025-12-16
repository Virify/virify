<template>
  <div class="p-dock" :class="{
    'p-dock--has-grid': showGrid
  }">
    <OrganismsPaneSlider @boundary-exceeded="updateViewMode" :left-slot="showGrid" :right-slot="showMap" :class="{
      '| container': showGrid
    }">
      <template #left v-if="showGrid">
        <OrganismsResults v-if="!isMounted || isLoading || results.length" :results
          :is-loading="!isMounted || isLoading" :query-analysis="searchState?.queryAnalysis"
          :location="searchState?.location" :radius="searchState?.radius" @open-popover="handleOpenPopover" />
        <MoleculesAiSearchNoResults v-else :last-search-query="searchState?.query || 'No previous search'" />
      </template>

      <template #right v-if="showMap">
        <LazyOrganismsAiSearchMapView class="p-dock__map" :results :is-searching="isLoading" :radius :location />
      </template>
    </OrganismsPaneSlider>

    <OrganismsDock ref="dockRef" />
  </div>
</template>

<script setup lang="ts">
import type { SortOrder } from '~/composables/useSearchState'

const route = useRoute()

/**
 * SEO - Dynamic meta tags based on search params
 */
const locationName = computed(() => {
  const slug = route.params.location as string
  if (!slug) return 'UK'
  // Convert slug to readable text and capitalize first letter of each word
  return slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
})

const radiusText = computed(() => {
  const slug = route.params.radius as string
  if (slug === 'this-area-only') return 'in'
  const match = slug?.match(/^(\d+)-miles?$/)
  return match ? `within ${match[1]} miles of` : 'near'
})

const searchQueryText = computed(() => {
  const prompt = route.params.prompt
  const slug = Array.isArray(prompt) ? prompt.join(' ') : prompt as string
  if (!slug) return 'properties'
  return slug.replace(/-/g, ' ')
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

/**
 *  Handle searches
 */
const location = computed(() => asObject(searchState.value).location)
const radius = computed(() => asObject(searchState.value).radius)
const sortBy = computed(() => asObject(searchState.value).sortBy)
const viewMode = computed(() => asObject(searchState.value).viewMode)
const query = computed(() => asObject(searchState.value).query)

const { aiSearch } = useAi()

/**
 * Slugify text for URL
 */
function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/**
 * Trigger search - called on initial load only
 */
async function triggerSearch() {
  const { location: loc, query: q, radius: r } = asObject(searchState.value)

  if (!loc || !q) return

  setSearchPending(true)

  try {
    const { queryAnalysis, results } = await aiSearch(loc, r, q, 1)

    if (queryAnalysis) setQueryAnalysis(queryAnalysis)
    setResults(results)
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
const results = computed(() => {
  const { results } = asObject(searchState.value)
  if (!Array.isArray(results)) return []
  return results
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
const isMounted = ref(false)

/**
 * Parse radius from URL param (e.g., "5-miles" -> 5, "this-area-only" -> 0)
 */
function parseRadius(radiusParam: string): number {
  if (radiusParam === 'this-area-only') return 0
  const match = radiusParam.match(/^(\d+)-miles?$/)
  return match ? parseInt(match[1], 10) : 5
}

/**
 * Convert slug back to readable text (e.g., "3-bed-house-with-garden" -> "3 bed house with garden")
 */
function slugToText(slug: string): string {
  return decodeURIComponent(slug).replace(/-/g, ' ')
}

onMounted(async () => {
  isMounted.value = true

  // Parse URL params
  const locationSlug = route.params.location as string
  const radiusSlug = route.params.radius as string
  const promptSlug = Array.isArray(route.params.prompt) 
    ? route.params.prompt.join('/') 
    : route.params.prompt as string

  if (!locationSlug || !radiusSlug || !promptSlug) {
    return navigateTo('/search')
  }

  // Parse radius
  const radiusValue = parseRadius(radiusSlug)

  // Convert prompt slug to text
  const promptText = slugToText(promptSlug)

  // Geocode the location name
  try {
    const { geocodeAndSelectBest } = useMap()
    const locationData = await geocodeAndSelectBest(slugToText(locationSlug))

    if (locationData) {
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
}
</style>
