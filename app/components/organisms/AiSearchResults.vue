<template>
  <div class="p-ai-search-results | container flow" v-if="results">
    <h2 class="results-title | title-md">
      Found {{ totalResults }} results
      <span v-if="totalPages > 1" class="body-sm"> (Page {{ currentPage }} of {{ totalPages }})</span>
    </h2>

    <ul class="p-ai-search-results__list">
      <li v-for="listing in results" :key="listing.id">
        <MoleculesListingCardNew :listing="listing" />
      </li>
    </ul>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination | body-sm font-bold">
      <button 
        @click="$emit('page-change', currentPage - 1)"
        :disabled="currentPage === 1"
        class="button button-ghost button-sm"
      >
        Previous
      </button>
      
      <span class="pagination-info">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      
      <button 
        @click="$emit('page-change', currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="button button-secondary button-sm"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  results: ListingWithFullProperty[];
  queryAnalysis: QueryAnalysis | null;
  currentPage: number;
  totalPages: number;
  totalResults: number;
}>();

defineEmits<{
  'page-change': [page: number];
}>();
</script>

<style lang="scss">
.p-ai-search-results {
  &__list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--size-32);
    margin: 0;
    padding: 0;
    list-style: none;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
}

 .results-title {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--size-16);
  margin-top: var(--size-32);
  margin-bottom: var(--size-48);
}

.pagination-info {
  font-size: var(--font-size-sm);
  color: var(--foreground-200);
  font-weight: var(--font-medium);
}
</style>
