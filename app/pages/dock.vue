<template>
  <div class="p-dock" :class="{
    'p-dock--has-grid': showGrid
  }">
    <OrganismsPaneSlider @boundary-exceeded="updateViewMode" :left-slot="showGrid" :right-slot="showMap" :class="{
      '| container': showGrid
    }">
      <template #left v-if="showGrid">
        <OrganismsResults v-if="isLoading || results.length" :results :is-loading />
        <MoleculesAiSearchNoResults v-else :last-search-query="searchState?.query || 'No previous search'" />
      </template>

      <template #right v-if="showMap">
        <LazyOrganismsAiSearchMapView class="p-dock__map" :results :is-searching="isLoading" :radius :location />
      </template>
    </OrganismsPaneSlider>

    <OrganismsDock />
  </div>
</template>

<script setup>
const {
  isLoading,
  refreshFromKV,
  searchState,
  setResults,
  setQueryAnalysis,
  setSearchPending,
  setViewMode,
  setSortOrder
} = useSearchState()

/**
 *  Update layout
 */
function updateViewMode(viewMode) {
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

const { setPendingWhile } = usePending()
const { aiSearch } = useAi();

watch([location, radius, query], () => {
  // Get current location, radius
  const { location, query, radius } = asObject(searchState.value)

  // Do not search if no location or query is added
  if (!location || !query) return

  // Set pending state
  setSearchPending(true)

  // Set pending state
  setPendingWhile(async () => {
    if (!location) return

    const { queryAnalysis, results } = await aiSearch(location, radius, query, 1);

    // Remove loading state
    setSearchPending(false)

    // Save results
    setQueryAnalysis(queryAnalysis)
    setResults(results)
  }).finally(() => {
    // Remove loading state, e.g. in case of error
    setSearchPending(false)
  })
}, { deep: true })

watch(sortBy, (newValue) => {
  setSortOrder(newValue)
})

watch(viewMode, (layout) => {
  if (layout !== 'map') return

  window.scrollTo({
    top: 0,
    behavior: 'instant'
  })
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
 *  Load search state on page mounted
 */
onMounted(() => {
  refreshFromKV()
})

</script>

<style lang="scss">
.p-dock {

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
