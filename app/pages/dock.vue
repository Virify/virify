<template>
  <div class="p-dock | container">
    <OrganismsPaneSlider @boundary-exceeded="updateViewMode" :left-slot="showGrid" :right-slot="showMap">
      <template #left v-if="showGrid">
        <pre>{{ searchState }}</pre>
      </template>

      <template #right v-if="showMap">
        <OrganismsAiSearchMapView class="p-dock__map" :results :is-searching="isLoading" />
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
  setSearchPending
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
const { location, radius, sortBy, query } = toRefs(searchState.value)
const { setPendingWhile } = usePending()
const { aiSearch } = useAiSearchPage();

watch([location, radius, sortBy, query], () => {
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

/**
 *  Ensure missing results do not break the map
 */
const results = computed(() => {
  const { results } = asObject(searchState.value)

  if (!Array.isArray(results)) return []

  return results
})

</script>

<style scoped>
pre {
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  background-color: lightpink;
  border-radius: var(--border-radius-2xl);
  padding: var(--size-32);
  overflow: hidden;
  margin: 0;
}
</style>

<style lang="scss">
.p-dock {
  padding: var(--size-16) 0;

  &__map {
    position: sticky;
    top: calc(var(--header-height) + var(--size-20));
    height: calc(100vh - var(--header-height) - var(--size-32));
    width: 100%;
    background: var(--monochrome-400);
    border-radius: var(--border-radius-2xl);
    overflow: hidden;
  }
}
</style>
