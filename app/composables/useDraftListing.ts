import { createSharedComposable } from "@vueuse/core";
import type { DraftListing, ListingTier } from "~~/layers/database/server/database/prisma/generated/client";

export const useDraftListing = createSharedComposable(() => {
  const { showToast } = useToast();

  const { data: draftListings, refresh: refreshDraftListings, pending: draftListingsPending } = useAsyncData<DraftListingWithFullPayload[]>(
    "draft-listings",
    async () => await useRequestFetch()<DraftListingWithFullPayload[]>(`/api/draft-listings/user/`),
    { immediate: true}
  );

  /**
   * Retrieves a draft listing by its ID.
   * @param id ID of the draft listing to retrieve
   * @returns The draft listing if found, null otherwise
   */
  const draftListing = (id: number): DraftListingWithFullPayload | null => {
    return draftListings.value?.find((draft) => draft.id === id) || null;
  };

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

  /**
   * Updates the first step of a draft listing.
   * @param draftId ID of the draft listing to update
   * @param stepData Data for the first step
   */
  async function updateDraftStepOne(draftId: number, stepData: StepOne) {
    try {
      await $fetch(`/api/draft-listings/update/steps/one/`, {
        method: "PATCH",
        body: {
          draftId,
          ...stepData,
        },
      });
      refreshDraftListings();
      showToast("Draft listing updated", { type: "success" });
    } catch (error) {
      showToast("Failed to update draft listing", { type: "error" });
      console.error("Error updating draft listing:", error);
    }
  };

  async function updateDraftStepTwo(draftId: number, stepData: StepTwo) {
    console.log("Updating draft step two for draftId:", draftId, "with data:", stepData);
    try {
      await $fetch(`/api/draft-listings/update/steps/two/`, {
        method: "PATCH",
        body: {
          draftId,
          ...stepData,
        },
      });
      refreshDraftListings();
      // showToast("Draft listing updated", { type: "success" });
    } catch (error) {
      showToast("Failed to update draft listing", { type: "error" });
      console.error("Error updating draft listing:", error);
    }
  }

  return {
    draftListings,
    draftListing,
    draftListingsPending,
    refreshDraftListings,
    createDraftListing,
    deleteDraftListing,
    updateDraftStepOne,
    updateDraftStepTwo
  };
});
