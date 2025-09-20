<template>
  <OrganismsAccountCreateListingHero />
  <AtomsAccountCardContainer>
    <div class="create-listing__info">
      <pre v-if="draftListings && draftListings.length" class="body-sm">{{ draftListings }}</pre>
      <p v-else class="body-sm">No draft listings available.</p>
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

const { draftListings } = useDraftListing();

</script>
<style lang="scss">
.create-listing__info {
  padding: var(--size-16);
}
</style>
