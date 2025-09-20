<template>
  <OrganismsAccountCreateListingHero />
  <AtomsAccountCardContainer>
    <div class="create-listing__info">
      <p v-if="draftListingsPending" class="body-sm">Loading...</p>
      <p v-else-if="!draftListings.length" class="body-sm">No draft listings available.</p>
      <pre v-else class="body-sm">{{ draftListings }}</pre>
    </div>
  </AtomsAccountCardContainer>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Create a Listing",
  },
  layout: "account",
});

const { draftListings, draftListingsPending } = useDraftListing();

</script>
<style lang="scss">
.create-listing__info {
  padding: var(--size-16);
}
</style>
