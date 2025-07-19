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
const { searchState, setFilters, setSearchPending } = useSearchState()
const { aiSearch } = useAiSearchPage();

function searchSubmit(query: string) {
  setSearchPending(true)

  // Get current location, radius
  const { location, radius } = asObject(searchState.value)

  // Set pending state
  setPendingWhile(async () => {
    if (!location) return

    const { queryAnalysis } = await aiSearch(location, radius, query, 1);

    setFilters({ query, queryAnalysis })
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
