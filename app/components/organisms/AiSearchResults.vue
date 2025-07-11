<template>
  <div class="p-ai-search-results | container flow" v-if="results">
    <h2 class="results-title | title-md">
      Found {{ props.totalResults }} results
      <span v-if="hasPagination" class="body-sm"> (Page {{ props.currentPage }} of {{ props.totalPages }})</span>
    </h2>

    <ul class="p-ai-search-results__list">
      <li v-for="listing in results" :key="listing.id">
        <MoleculesListingCardNew :listing="listing" />
      </li>
    </ul>

    <!-- Pagination -->
    <div v-if="hasPagination" class="pagination | body-sm font-bold">
      <button 
        @click="$emit('page-change', props.currentPage - 1)"
        :disabled="props.currentPage === 1"
        class="button button-ghost button-sm"
      >
        Previous
      </button>
      
      <span class="pagination-info">
        Page {{ props.currentPage }} of {{ props.totalPages }}
      </span>
      
      <button 
        @click="$emit('page-change', props.currentPage + 1)"
        :disabled="props.currentPage === props.totalPages"
        class="button button-secondary button-sm"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  results: ListingWithFullProperty[];
  queryAnalysis: QueryAnalysis | null;
  currentPage?: number;
  totalPages?: number;
  totalResults?: number;
}>(), {
  currentPage: 1,
  totalPages: 1,
  totalResults: 0
});

defineEmits<{
  'page-change': [page: number];
}>();

const hasPagination = computed(() => props.totalPages > 1);
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
    margin-bottom: var(--size-40);
    
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
