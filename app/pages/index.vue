<template>
  <div>
    <OrganismsHeroHome />

    <SearchListings v-if="searchListings" :listings="searchListings" />
    <div v-else>
      <FeaturedListings :listings="listings" />

      <MoleculesPagination
        v-model:currentPage="currentPage"
        :has-more-listings="hasMoreListings"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * state
 */
const searchListings = ref<ListingWithFullProperty[] | null>(null);
provide("searchListings", searchListings);
const pageSize = 12;

/**
 * Pagination setup from composable
 */
const { listings, currentPage, hasMoreListings } = usePaginatedListings<ListingWithFullProperty>('/api/listings/featured', pageSize);
</script>

<style>
.p-index-spacer {
  height: 100vh;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
}

.pagination-info {
  font-size: 16px;
  font-weight: bold;
}
</style>
