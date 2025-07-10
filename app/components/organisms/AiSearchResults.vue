<template>
  <div class="p-ai-search-results | container flow" v-if="results">
    <h2 class="title-md">
      Found {{ results.length }} result<span v-if="results.length !== 1">s</span>
    </h2>

    <ul class="p-ai-search-results__list">
      <li v-for="listing in results" :key="listing.id">
        <MoleculesListingCardNew :listing="listing" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  results: ListingWithFullProperty[];
  queryAnalysis: QueryAnalysis | null;
}>();
</script>

<style lang="scss">
.p-ai-search-results {
  padding: var(--size-32) 0;
  &__list {
    gap: var(--size-16);
  }
}

.query-analysis {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: var(--background-100);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-color-200);
}

.p-ai-search-results__list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--size-32);
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (max-width: 768px) {
  .p-ai-search-results__list {
    grid-template-columns: 1fr;
  }
}
</style>
