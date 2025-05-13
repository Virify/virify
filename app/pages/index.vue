<template>
  <div ref="scrollContainer">
    <client-only>
      <OrganismsSearchForm />
    </client-only>

    <OrganismsHeroHome />

    <div class="p-listing-test-grid | container">
      <MoleculesListingCard v-for="listing in typeOfListing" :key="listing.id" :property-id="listing.id"
        :image="listing.property?.media" :price="listing.price" :property-type="listing.property?.type?.name"
        :address="listing.property?.address" :bedrooms="listing.property?.numberBedrooms"
        :bathrooms="listing.property?.numberBathrooms" :description="listing.title" />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * State
 */
const searchListings = ref<ListingCardType[] | null>(null);
provide("searchListings", searchListings);
const searchParams = useState<Record<string, any>>("searchParams");

watch(searchParams, () => {
  if(searchParams.value) {
    console.log("searchParams", searchParams.value);
  }
})

const typeOfListing = computed(() => {
  return searchListings.value ?? initialListings.value;
});

/**
 * Fetch initial listings
 */
const { data: initialListings } = await useAsyncData('featured-listings', () =>
  $fetch<ListingCardType[]>('/api/listings/featured')
);
</script>
<style>
.p-listing-test-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--size-28);
  padding: var(--size-56);
}
</style>