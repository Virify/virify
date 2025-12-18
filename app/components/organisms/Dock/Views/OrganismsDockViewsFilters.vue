<template>
  <div class="| flow">
    <MoleculesAiSearchLoading v-if="isLoading" />

    <template v-else>
      <h2 class="| title-md">Describe your new home</h2>

      <MoleculesAiSearchFormFilters :initial-query :loading="isChecking" @submit-search="searchSubmit" @reset-search="searchReset" />
    </template>
  </div>
</template>

<script setup lang="ts">
const initialQuery = ref('')

/**
 *  Fetch filters
 */
const { searchState, isLoading } = useSearchState()
const { checkContent, isChecking } = useModeration()
const { showToast } = useToast()

async function searchSubmit(query: string) {
  const { location, radius } = asObject(searchState.value)
  
  if (!location) return

  // Check content moderation before proceeding
  const { safe, reason } = await checkContent(query)
  if (!safe) {
    showToast(reason || 'Please try a different search.', { type: 'error' })
    return
  }

  // Build clean URL and navigate - this will trigger the search
  await navigateTo(createSearchURL(location, radius ?? 5, query))
}

function searchReset() {
  // Navigate to home to start fresh
  navigateTo('/')
}

</script>
