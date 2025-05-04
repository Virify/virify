<template>
  <div>
    <OrganismsHeroHome />

    <SearchListings v-if=searchListings :listings="searchListings" />
    <FeaturedListings v-else :listings="filteredListings" />
  </div>
</template>

<script setup lang="ts">

const searchListings = ref<ListingWithFullProperty[] | null>(null);
provide('searchListings', searchListings);


const { data: listings, error } = await useAsyncData("listings", () => $fetch<ListingWithFullProperty[]>("/api/listings/all"));

const filteredListings = computed(() => {
  if (!listings.value) return [];
  return listings.value.filter((listing) => listing.listingTier === "FEATURED");
});

console.log("Filtered Listings", filteredListings.value);
</script>

<style>
.p-index-spacer {
  height: 100vh;
}
</style>
