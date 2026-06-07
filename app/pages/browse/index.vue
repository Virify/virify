<template>
  <div class="p-browse | container">
    <BrowseToggleOnlyHeader class="p-browse__search-form" v-model="buyOrRent" />

    <h2 class="p-browse__title | title-sm">
      Showing {{ filteredResults.length }} result{{ filteredResults.length === 1 ? '' : 's' }}
    </h2>

    <div v-if="!isPending && !filteredResults.length" class="p-browse__no-results">
      <h2 class="p-browse__no-results-title | title-xl">
        No results found
      </h2>

      <p class="p-browse__no-results-subtitle | body-md">
        We couldn't find any properties matching your search
      </p>
    </div>

    <OrganismsResults v-else :results="filteredResults" :is-loading="isPending" :show-context="false"
      class="p-browse__results" />
  </div>
</template>

<script setup lang="ts">
/**
 *  Results
 */
const { results, isPending } = useViewAllListings()

/**
 *  Toggle whether to show buy or sell
 */
const buyOrRent = ref<'buy' | 'rent'>('buy')

const filteredResults = computed(() => {
  if (!Array.isArray(results.value)) return []

  const isBuy: boolean = buyOrRent.value === 'buy'

  return results.value.filter(property => {
    if (isBuy) return !!property.saleListing

    return !!property.rentalListing
  })
})
</script>

<style lang="scss">
.p-browse {

  &__title {
    margin: var(--size-24) 0;
  }

  &__results {
    margin: var(--size-32) auto;

    .o-results__gradient {
      display: none;
    }
  }

  &__no-results {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-height: 50vh;
    max-width: 40ch;
    margin: var(--size-72) auto;
  }

  &__search-form {
    z-index: 3;
  }
}
</style>