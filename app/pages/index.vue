<template>
  <div>
    <OrganismsHeroHome />

    <SearchListings v-if=searchListings :listings="searchListings" />
    <FeaturedListings v-else :listings="listings" />
  </div>
</template>

<script setup lang="ts">

const searchListings = ref<ListingWithFullProperty[] | null>(null);
provide('searchListings', searchListings);

const numberOfListings = 12;
const { data: listings } = await useAsyncData("listings", () => $fetch<ListingWithFullProperty[]>("/api/listings/featured?amount=" + numberOfListings));

</script>

<style>
.p-index-spacer {
  height: 100vh;
}
</style>
