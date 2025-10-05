<template>
  <div class="| flow">
    <MoleculesAiSearchLoading v-if="isLoading" />

    <template v-else>
      <OrganismsFilterSwitcher show-titles>
        <template v-slot:traditional>
          <OrganismsTraditionalSearchForm />
        </template>

        <template v-slot:ai>
          <MoleculesAiSearchFormFilters :initial-query @submit-search="searchSubmit" @reset-search="searchReset" />
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
const { setQuery, isLoading } = useSearchState()

function searchSubmit(query: string) {
  setQuery(query)
};

function searchReset() {
  setQuery('')
}

</script>
