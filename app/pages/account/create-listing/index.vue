<template>
  <OrganismsAccountCreateListingHero />
  <AtomsAccountCardContainer>
    <div class="p-create-listing">
      <p v-if="draftListingsPending" class="body-sm">Loading...</p>
      <p v-else-if="!draftListings.length" class="body-sm">No draft listings available.</p>
      <NuxtLink
        v-else
        v-for="draft in draftListings"
        :key="draft.id"
        :to="`/account/create-listing/${draft.id}`"
        class="p-create-listing__link | body-sm"
      >
        <pre class="body-sm">{{ draftListings }}</pre>
      </NuxtLink>
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
.p-create-listing {
  padding: var(--size-16);

  &__link {
    text-decoration: none;
  }
}
</style>
