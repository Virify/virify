import { createSharedComposable } from "@vueuse/core";
import type { DraftListing } from "~~/layers/database/server/database/prisma/generated/client";

export const useDraftListing = createSharedComposable(() => {
  const { loggedIn, user } = useUserSession();
  const { showToast } = useToast();

  const { data: draftListings, refresh: refreshDraftListings } = useAsyncData<DraftListing[]>("draft-listings", () => {
    if (!loggedIn.value || !user.value) {
      return Promise.resolve([]);
    }
    return useRequestFetch()<DraftListing[]>(`/api/draft-listings/`);
  });

  /**
   * Adds a new draft listing.
   * @param tier Tier option for the new draft listing
   * @returns
   */
  async function createDraftListing(tier: TierOption) {
    try {
      await $fetch<DraftListing>("/api/draft-listings/create/", {
        method: "POST",
        body: {
          tier,
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
    refreshDraftListings,
    createDraftListing,
    deleteDraftListing,
  };
});
