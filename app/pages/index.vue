<template>
  <div ref="scrollContainer">
    <OrganismsHeroHome />

    <div class="p-listing-test-grid">
      <MoleculesListingCard v-for="listing in typeOfListing" :key="listing.id" :property-id="listing.id"
        :image="listing.property?.media" :price="listing.price" :property-type="listing.property?.type?.name"
        :address="listing.property?.address" :bedrooms="listing.property?.numberBedrooms"
        :bathrooms="listing.property?.numberBathrooms" :description="listing.title" />
    </div>
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

<style>
.p-listing-test-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  row-gap: var(--size-56);
  column-gap: var(--size-28);
  padding: var(--size-56);
}
</style>