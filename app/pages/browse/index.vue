<template>
  <div class="p-browse | container">
    <BrowseSimpleHeader class="p-browse__search-form" :count="results.length" />

    <h2 class="p-browse__title | title-sm">
      Showing {{ results.length }} result{{ results.length === 1 ? '' : 's' }}
    </h2>

    <OrganismsResults v-if="results.length" :results :is-loading="isPending" :show-context="false"
      class="p-browse__results" />

    <div v-else class="p-browse__no-results">
      <h2 class="p-browse__no-results-title | title-xl">
        No results found
      </h2>

      <p class="p-browse__no-results-subtitle | body-md">
        We couldn't find any properties matching your search
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 *  Results
 */
const { results, isPending } = useViewAllListings()

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
    z-index: 99;
  }
}
</style>