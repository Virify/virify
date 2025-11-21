<template>
  <AtomsAccountCardContainer>
    <MoleculesListingAdvert
      title="Ready to create a listing?"
      description="Save time and know what you need up-front to create a listing. Please check out our guide on what you need to know before you start creating a listing."
      linkText="What you need to know"
      link="/guides/property-information"
      :showNote="false"
    />
  </AtomsAccountCardContainer>
  <OrganismsAccountCreateListingHero />
  <AtomsAccountCardContainer>
    <ClientOnly>
      <div class="p-create-listing">
        <p v-if="!draftListings?.length" class="body-sm">No draft listings available.</p>
        <div v-else class="p-create-listing__grid">
          <MoleculesListingListingCard
            v-for="draft in draftListings"
            :key="draft.id"
            :draft="draft"
            :deleting="isDraftDeleting(draft.id)"
            :publishing="isPublishing(draft.id)"
            @delete="handleDelete"
            @publish="handlePublish"
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

const { draftListings, draftListingsPending, deleteDraftListing, isDraftDeleting, refreshDraftListings } = useListingEdit();
const { showToast } = useToast();

const publishingDrafts = ref<Set<number>>(new Set());

const isPublishing = (draftId: number) => publishingDrafts.value.has(draftId);

const handleDelete = async (draftId: number) => {
  await deleteDraftListing(draftId);
};

const handlePublish = async (draftId: number) => {
  try {
    publishingDrafts.value.add(draftId);
    
    const result = await useRequestFetch()<{ listingId: number }>(`/api/listing/publish`, {
      method: 'POST',
      body: { draftId }
    });
    
    showToast('Listing published successfully!', { type: 'success' });
    
    // Refresh draft listings to remove the published one
    await refreshDraftListings();
    
    // Navigate to the published listing
    if (result?.listingId) {
      await navigateTo(`/listing/${result.listingId}`);
    }
  } catch (error: any) {
    console.error('Failed to publish listing:', error);
    showToast(error?.data?.message || 'Failed to publish listing. Please try again.', { type: 'error' });
  } finally {
    publishingDrafts.value.delete(draftId);
  }
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
