<template>
  <div class="p-dock" :class="{
    'p-dock--has-grid': showGrid
  }">
    <OrganismsPaneSlider @boundary-exceeded="updateViewMode" :left-slot="showGrid" :right-slot="showMap" :class="{
      '| container container-lg': showGrid
    }">
      <template #left v-if="showGrid">
        <MoleculesAiSearchLoading v-if="isLoading" :last-search-query="lastSearchQuery" />
        <MoleculesAiSearchNoResults v-else-if="!results.length" :last-search-query="lastSearchQuery" />

        <OrganismsResults v-else :results />
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
  searchState,
  setResults,
  setQueryAnalysis,
  setSearchPending,
  setViewMode
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
 *  No results message
 */
const { lastSearchQuery, updateSort } = useAiSearchPage()

/**
 *  Handle searches
 */
const { location, radius, sortBy, query, viewMode } = toRefs(searchState.value)
const { setPendingWhile } = usePending()
const { aiSearch } = useAiSearchPage();

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

    setQueryAnalysis(queryAnalysis)
    setResults(results)
  }).finally(() => {
    setSearchPending(false)
  })
}, { deep: true })

watch(sortBy, (newValue) => {
  // @TODO
  // The KV store needs fixing before this can be activated
  console.log('@TODO: sort results by', newValue)
  // updateSort(newValue)
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
    background: var(--monochrome-400);
    overflow: hidden;
    height: calc(100vh - var(--header-height));
  }
}
</style>
