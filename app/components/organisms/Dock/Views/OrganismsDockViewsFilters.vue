<template>
  <div class="| flow">
    <h2 class="| title-md">AI filters</h2>

    <div v-if="isLoading">Loading...</div>

    <MoleculesAiSearchFormFilters v-else :initial-query @submit-search="searchSubmit" @reset-search="searchReset" />
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
