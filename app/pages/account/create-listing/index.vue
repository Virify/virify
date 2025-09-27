<template>
  <OrganismsAccountCreateListingHero />
  <AtomsAccountCardContainer>
    <ClientOnly>
      <div class="p-create-listing">
        <p v-if="!draftListings?.length" class="body-sm">No draft listings available.</p>
        <div v-else class="p-create-listing__grid">
          <MoleculesDraftListingCard
            v-for="draft in draftListings"
            :key="draft.id"
            :draft="draft"
            :deleting="isDraftDeleting(draft.id)"
            @delete="handleDelete"
          />
        </div>
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

const { draftListings, draftListingsPending, deleteDraftListing, isDraftDeleting } = useDraftListing();

const handleDelete = async (draftId: number) => {
  await deleteDraftListing(draftId);
};

</script>
<style lang="scss">
@use "#styles/_utils/media" as mq;

.p-create-listing {
  padding: var(--size-16);

  &__grid {
    display: grid;
    gap: var(--size-16);
    grid-template-columns: 1fr;
    justify-items: center;
  }
}
</style>
