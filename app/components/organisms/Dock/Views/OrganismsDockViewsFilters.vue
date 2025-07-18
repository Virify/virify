<template>
  <div class="| flow">
    <h2 class="| title-md">AI filters</h2>

    <div v-if="isPending">Loading...</div>

    <MoleculesAiSearchFormFilters v-else :initial-query @submit-search="searchSubmit" @reset-search="searchReset" />
  </div>
</template>

<script setup lang="ts">
const initialQuery = ref('')

/**
 *  Fetch filters
 */
const { isPending, setPendingWhile } = usePending()
const { state, setAiFilters, setSearchPending } = useUniversalSearch()
const { aiSearch } = useAiSearchPage();

function searchSubmit(filterString: string) {
  setSearchPending(true)

  // Get current location, locationRadius
  const { location, locationRadius } = asObject(state.value)

  // Set pending state
  setPendingWhile(async () => {
    if (!location) return

    const response = await aiSearch(location as GeocodingFeature, locationRadius as number, filterString, 1);

    setAiFilters(response as unknown)
  }).then(() => {
    emits('close')
  }).finally(() => {
    setSearchPending(false)
  })
};

function searchReset() {
  console.log('reset-search')
}

/**
 *  Allow closing
 */
const emits = defineEmits(['close'])
</script>
