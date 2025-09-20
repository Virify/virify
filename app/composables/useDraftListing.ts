import { createSharedComposable } from "@vueuse/core";
import type { DraftListing, ListingTier } from "~~/layers/database/server/database/prisma/generated/client";

export const useDraftListing = createSharedComposable(() => {
  const { showToast } = useToast();

  const { data: draftListings, refresh: refreshDraftListings, pending: draftListingsPending } = useAsyncData<DraftListing[]>(
    "draft-listings",
    async () => await useRequestFetch()<DraftListing[]>(`/api/draft-listings/user/`),
    { default: () => [], immediate: true}
  );

  /**
   * Adds a new draft listing.
   * @param tier Tier option for the new draft listing
   * @returns
   */
  async function createDraftListing(tier: TierOption) {
    try {
      const title = `New ${tier.tier.charAt(0).toUpperCase() + tier.tier.slice(1)} Listing`;
      
      await $fetch<DraftListing>("/api/draft-listings/create/", {
        method: "POST",
        body: {
          tier: tier.tier.toUpperCase() as ListingTier,
          title
        },
      });
      refreshDraftListings();
      showToast("Draft listing created", { type: "success" });
    } catch (error) {
      showToast("Failed to create draft listing", { type: "error" });
      console.error("Error creating draft listing:", error);
    }
  }

  /**
   * Deletes a draft listing.
   * @param draftListingId ID of the draft listing to delete
   */
  async function deleteDraftListing(draftListingId: number) {
    try {
      await $fetch(`/api/draft-listings/${draftListingId}`, {
        method: "DELETE",
      });
      refreshDraftListings();
      showToast("Draft listing deleted", { type: "success" });
    } catch (error) {
      showToast("Failed to delete draft listing", { type: "error" });
      console.error("Error deleting draft listing:", error);
    }
  }

  return {
    draftListings,
    draftListingsPending,
    refreshDraftListings,
    createDraftListing,
    deleteDraftListing,
  };
});
