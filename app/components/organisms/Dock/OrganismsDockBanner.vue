<template>
  <div class="o-dock-banner | container">
    <div class="o-dock-banner__form | flow">
      <h1 class="| title-lg">Find your perfect property</h1>

      <MoleculesAiSearchFormLocation />
      <MoleculesAiSearchFormFilters :initial-query :disabled="isDisabled" @submit-search="searchSubmit"
        @reset-search="searchReset" />
    </div>
  </div>
</template>

<script setup lang="ts">
const initialQuery = ref('')

/**
 *  Fetch filters
 */
const { setQuery, searchState } = useSearchState()

async function searchSubmit(query: string) {
  setQuery(query)

  await navigateTo({
    path: '/dock'
  })
};

function searchReset() {
  setQuery('')
}

/**
 *  Disable filters button if no location is added
 */
const isDisabled = computed(() => {
  const { location } = asObject(searchState.value)

  return !location
})
</script>

<style lang="scss">
.o-dock-banner {
  padding: var(--size-64) var(--size-32);
  box-sizing: border-box;

  &__form {
    max-width: min(100%, 45rem);
    margin: 0 auto;
  }
}
</style>