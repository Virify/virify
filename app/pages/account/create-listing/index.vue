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
            :deleting="deletingIds.has(draft.id)"
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

const { draftListings, draftListingsPending, refreshDraftListings } = useDraftListing();

// Track which drafts are currently being deleted
const deletingIds = ref(new Set<number>());

const handleDelete = async (draftId: number) => {
  if (deletingIds.value.has(draftId)) return;
  
  const confirmDelete = confirm('Are you sure you want to delete this draft listing? This action cannot be undone.');
  if (!confirmDelete) return;

  deletingIds.value.add(draftId);

  try {
    await $fetch(`/api/draft-listings/${draftId}`, {
      method: 'DELETE'
    });
    
    // Refresh the draft listings after successful deletion
    await refreshDraftListings();
    
    // Show success message
    const { showToast } = useToast();
    showToast('Draft listing deleted successfully', { type: 'success' });
  } catch (error) {
    console.error('Error deleting draft listing:', error);
    const { showToast } = useToast();
    showToast('Failed to delete draft listing. Please try again.', { type: 'error' });
  } finally {
    deletingIds.value.delete(draftId);
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
