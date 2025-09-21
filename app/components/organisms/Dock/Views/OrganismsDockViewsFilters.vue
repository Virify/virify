<template>
  <div class="| flow">
    <MoleculesAiSearchLoading v-if="isLoading" />

    <template v-else>
      <h2 class="| title-md">AI filters</h2>

      <MoleculesAiSearchFormFilters :initial-query @submit-search="searchSubmit" @reset-search="searchReset" />
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
