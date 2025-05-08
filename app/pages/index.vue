<template>
  <div ref="scrollContainer">
    <OrganismsHeroHome />

    <ListingCard :listings="typeOfListing" :title="searchListings ? `Search Results: ` : `Featured Listings: `" />
      <div ref="infiniteTrigger" class="p-index-spacer"></div>
  </div>
</template>

<script setup lang="ts">
import { usePaginatedListings } from '~/composables/usePaginatedListings';
import { useIntersectionObserver } from '@vueuse/core';
/**
 * State
 */
const searchListings = ref<ListingCardType[] | null>(null);
provide("searchListings", searchListings);
const pageSize = 20;

const typeOfListing = computed(() => {
  return searchListings.value ?? listings.value;
});

/**
 * Fetch initial listings
 */
const { data: initialListings } = await useAsyncData('featured-listings', () =>
  $fetch<ListingCardType[]>('/api/listings/featured?page=1&pageSize=12')
);

/**
 * Pagination
 */
const {
  listings,
  hasMoreListings,
  fetchMoreListings,
  isLoading
} = usePaginatedListings<ListingCardType>('/api/listings/featured', pageSize, initialListings.value || []);

/**
 * Infinite scroll trigger
 */
const infiniteTrigger = ref(null);

/**
 * Trigger for infinite scroll
 */
useIntersectionObserver(
  infiniteTrigger,
  (entries) => {
    const entry = entries[0];
    if (entry?.isIntersecting && hasMoreListings.value && !isLoading.value) {
      fetchMoreListings();
    }
  },
  {
    rootMargin: '0px 0px 200px 0px',
  }
);
</script>
