<template>
  <div ref="scrollContainer">
    <OrganismsHeroHome />

    <SearchListings v-if="searchListings" :listings="searchListings" />
    <div v-else>
      <FeaturedListings :listings="listings" />
      <div ref="infiniteTrigger" class="p-index-spacer"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePaginatedListings } from '~/composables/usePaginatedListings';
import { useIntersectionObserver } from '@vueuse/core';

/**
 * State
 */
const searchListings = ref<ListingWithFullProperty[] | null>(null);
provide("searchListings", searchListings);
const pageSize = 20;

/**
 * Fetch initial listings
 */
const { data: initialListings } = await useAsyncData('featured-listings', () =>
  $fetch<ListingWithFullProperty[]>('/api/listings/featured?page=1&pageSize=12')
);

/**
 * Pagination
 */
const {
  listings,
  hasMoreListings,
  fetchMoreListings,
  isLoading
} = usePaginatedListings<ListingWithFullProperty>('/api/listings/featured', pageSize, initialListings.value || []);

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
      console.log('Fetching more listings...');
      fetchMoreListings();
    }
  },
  {
    rootMargin: '0px 0px 200px 0px',
  }
);
</script>
