<template>
  <div class="| flow">
    <MoleculesAiSearchLoading v-if="pending" />

    <template v-else>
      <OrganismsFilterSwitcher>
        <template v-slot:traditional>
          <OrganismsTraditionalSearchForm @submit-search="searchSubmit" />
        </template>

        <template v-slot:ai>
          <MoleculesAiSearchFormFilters hide-suggestions :initial-query @submit-search="searchSubmit"
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
const { pending, fetchResults } = useFetchResults()

async function searchSubmit() {
  emits('search-started')

  await fetchResults()
}

function searchReset() {
  // Navigate to home to start fresh
  navigateTo('/')
}

</script>
