<template>
  <div class="| flow">
    <MoleculesAiSearchLoading v-if="isLoading" />

    <template v-else>
      <h2 class="| title-md">AI filters</h2>

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

/**
 * Slugify text for URL
 */
function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

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
  // Use short text name for cleaner URLs (e.g. "Cardiff" instead of "Cardiff, Wales, United Kingdom")
  const locationSlug = slugify(location.text || location.place_name_en || location.place_name)
  const radiusSlug = radius === 0 ? 'this-area-only' : `${radius || 5}-miles`
  const promptSlug = slugify(query)

  await navigateTo(`/search/${locationSlug}/${radiusSlug}/${promptSlug}`)
}

function searchReset() {
  // Navigate to home to start fresh
  navigateTo('/')
}

</script>
