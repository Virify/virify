<template>
  <div class="| flow">
    <MoleculesAiSearchLoading v-if="isLoading" />

    <template v-else>
      <OrganismsFilterSwitcher>
        <template v-slot:traditional>
          <OrganismsTraditionalSearchForm @submit-search="traditionalSearchSubmit" />
        </template>

        <template v-slot:ai>
          <MoleculesAiSearchFormFilters hide-suggestions :initial-query @submit-search="aiSearchSubmit"
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
const { searchState, isLoading, setSearchType, setResults, setSearchPending, setQueryAnalysis } = useSearchState()
const { checkContent, isChecking } = useModeration()
const toast = useToast()

async function traditionalSearchSubmit(formData: TraditionalSearchData) {
  const { location, radius } = asObject(searchState.value)

  if (!location) {
    return
  }

  const body = {
    ...formData,
    location,
    radius,
  }

  try {
    setSearchPending(true)
    const response = await $fetch<ListingWithFullProperty[]>('/api/search/traditional', {
      method: 'POST',
      body
    })

    if (response) {
      // Build query analysis from form data for filter badges
      const queryAnalysis = buildQueryAnalysisFromFormData(formData)
      
      setSearchType('traditional')
      setQueryAnalysis(queryAnalysis)
      setResults(response)
      await navigateTo('/search')
    }
  } catch (error) {
    console.error('Traditional search error:', error)
    toast.add({ title: 'Error', description: 'Search failed. Please try again.', color: 'error' })
  } finally {
    setSearchPending(false)
  }
}

async function aiSearchSubmit(query: string) {
  const { location, radius, listingType } = asObject(searchState.value)

  if (!location) {
    return
  }

  // Check content moderation before proceeding
  const { safe, reason } = await checkContent(query)
  if (!safe) {
    toast.add({ title: 'Error', description: reason || 'Please try a different search.', color: 'error' })
    return
  }

  const body = {
    query,
    listingType: listingType === 'sale' ? 'sale' : listingType === 'rent' ? 'rent' : 'all',
    location,
    radius: radius ?? 5,
  }

  try {
    setSearchPending(true)
    const response = await $fetch('/api/search/rag', {
      method: 'POST',
      body
    })

    if (response) {
      setSearchType('ai')
      setResults(response.results || [])
      await navigateTo('/search')
      
      window.scrollTo({
        top: 0,
        behavior: "instant"
      })
    }
  } catch (error) {
    console.error('AI search error:', error)
    toast.add({ title: 'Error', description: 'Search failed. Please try again.', color: 'error' })
  } finally {
    setSearchPending(false)
  }
}

function searchReset() {
  // Navigate to home to start fresh
  navigateTo('/')
}

</script>
