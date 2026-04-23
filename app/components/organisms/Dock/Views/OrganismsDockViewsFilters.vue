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
            @reset-search="searchReset" />
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
const { state } = useGlobalSearchState()
const { searchState, isLoading, fetchResults } = useSearchState()

async function traditionalSearchSubmit(formData: TraditionalSearchData) {
  const { location, radius } = asObject(state.value)

  emits('search-started')

  await fetchResults({
    location,
    radius
  }, {
    type: 'traditional',
    body: formData
  },)
}

async function aiSearchSubmit(query: string) {
  const { location, radius } = asObject(state.value)
  const { listingType } = asObject(searchState.value)

  emits('search-started')

  await fetchResults({
    location,
    radius,
  }, {
    type: 'ai',
    body: {
      query,
      listingType: listingType === 'sale' ? 'sale' : listingType === 'rent' ? 'rent' : 'all',
    }
  })
}

function searchReset() {
  // Navigate to home to start fresh
  navigateTo('/')
}

</script>
