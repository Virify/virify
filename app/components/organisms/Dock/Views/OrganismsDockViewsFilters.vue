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
 *  Emits
 */
const emits = defineEmits(['search-started'])

/**
 *  Fetch filters
 */
const { searchState, isLoading, fetchResults } = useSearchState()
const { checkText, isChecking } = useModeration()
const toast = useToast()

async function traditionalSearchSubmit(formData: TraditionalSearchData) {
  const { location, radius } = asObject(searchState.value)

  emits('search-started')

  await fetchResults({
    type: 'traditional',
    body: {
      formData,
      location,
      radius,
    }
  })
}

async function aiSearchSubmit(query: string) {
  const { location, radius, listingType } = asObject(searchState.value)

  const { safe, reason } = await checkText(query)

  if (!safe) {
    toast.add({ title: 'Error', description: reason || 'Please try a different search.', color: 'error' })
    return
  }

  emits('search-started')

  await fetchResults({
    type: 'ai',
    body: {
      query,
      listingType: listingType === 'sale' ? 'sale' : listingType === 'rent' ? 'rent' : 'all',
      location,
      radius: radius ?? 5,
    }
  })
}

function searchReset() {
  // Navigate to home to start fresh
  navigateTo('/')
}

</script>
