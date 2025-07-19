<template>
  <div class="| container">
    <OrganismsPaneSlider @boundary-exceeded="updateViewMode" :left-slot="showGrid" :right-slot="showMap">
      <template #left v-if="showGrid">
        <pre>{{ searchState }}</pre>
      </template>

      <template #right v-if="showMap">
        <OrganismsAiSearchMapView class="p-dock__map" :results="[]" />
      </template>
    </OrganismsPaneSlider>

    <footer class="p-dock__demo-footer">
      <p class="| body-sm">Copy &copy; Virify</p>
    </footer>

    <OrganismsDock />
  </div>
</template>

<script setup>
const { searchState, setViewMode } = useSearchState()

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
const { location, radius } = toRefs(searchState.value)

watch([location, radius], () => {
  console.log(
    'Search properties!',
    JSON.parse(JSON.stringify(searchState.value))
  )
}, { deep: true })

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
}
</style>

<style lang="scss">
.p-dock {

  &__map {
    position: sticky;
    top: calc(var(--header-height) + var(--size-8));
    height: calc(100vh - var(--header-height) - var(--size-16));
    width: 100%;
    background: var(--monochrome-400);
    border-radius: var(--border-radius-2xl);
    overflow: hidden;
  }

  &__demo-footer {
    margin: var(--size-48) 0 0;
    padding: var(--size-16) 0;
  }
}
</style>
