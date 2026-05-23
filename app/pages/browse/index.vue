<template>
  <div class="p-browse | container">
    <BrowseSimpleHeader :count="results.length" />

    <OrganismsResults v-if="results.length" :results :is-loading="isPending" />

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

  &__no-results {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-height: 50vh;
    max-width: 40ch;
    margin: var(--size-72) auto;
  }
}
</style>