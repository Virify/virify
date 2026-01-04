<template>
  <div class="| flow">
    <MoleculesAiSearchLoading v-if="isLoading" />

    <template v-else>
      <OrganismsFilterSwitcher>
        <template v-slot:traditional>
          <OrganismsTraditionalSearchForm />
        </template>

        <template v-slot:ai>
          <MoleculesAiSearchFormFilters hide-suggestions :initial-query @submit-search="searchSubmit"
            :loading="isChecking" @reset-search="searchReset" />
        </template>
      </OrganismsFilterSwitcher>
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
  const { location, radius, listingType } = asObject(searchState.value)

  if (!location) return

  // Check content moderation before proceeding
  const { safe, reason } = await checkContent(query)
  if (!safe) {
    showToast(reason || 'Please try a different search.', { type: 'error' })
    return
  }

  // Build clean URL and navigate - this will trigger the search
  await navigateTo(createSearchURL(listingType, location, radius ?? 5, query))
}

function searchReset() {
  // Navigate to home to start fresh
  navigateTo('/')
}

</script>
