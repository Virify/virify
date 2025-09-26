<template>
  <OrganismsAccountCreateListingHero />
  <AtomsAccountCardContainer>
    <ClientOnly>
      <div class="p-create-listing">
        <p v-if="!draftListings?.length" class="body-sm">No draft listings available.</p>
        <NuxtLink
          v-else
          v-for="draft in draftListings"
          :key="draft.id"
          :to="`/account/create-listing/${draft.id}`"
          class="p-create-listing__link | body-sm"
        >
          <pre class="p-create-listing__draft | body-sm">{{ draft }}</pre>
        </NuxtLink>
      </div>
    </ClientOnly>
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

  &__draft {
    border: 1px solid var(--monochrome-200);
    padding: var(--size-16);
    border-radius: var(--border-radius-md);
  }
}
</style>
