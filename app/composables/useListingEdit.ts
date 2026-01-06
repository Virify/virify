import { createSharedComposable } from "@vueuse/core";
import type { DraftListing, Listing, ListingTier } from "~~/layers/database/server/database/prisma/generated/client";

// Type guard to check if it's a draft
export function isDraftListing(listing: EditableListing): listing is DraftListingWithFullPayload {
  return 'completedSteps' in listing;
}

// Type guard to check if it's a live listing  
export function isLiveListing(listing: EditableListing): listing is ListingWithFullProperty {
  return 'published' in listing && !('completedSteps' in listing);
}

export const useListingEdit = createSharedComposable(() => {
  const { showToast } = useToastNotification();

  // Track which drafts are currently being deleted
  const deletingIds = ref(new Set<number>());

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
   * @returns Promise<number> - The ID of the created draft listing
   */
  async function createDraftListing(tier: TierOption): Promise<number> {
    try {
      
      const createdListing = await useRequestFetch()<DraftListing>("/api/draft-listings/create/", {
        method: "POST",
        body: {
          tier: tier.tier.toUpperCase() as ListingTier,
        },
      });
      
      refreshDraftListings();
      showToast("Draft listing created successfully", { type: "success" });
      return createdListing.id;
    } catch (error) {
      console.error("Error creating draft listing:", error);
      throw createError({ statusCode: 500, statusMessage: "Failed to create draft listing" });
    }
  }

  /**
   * Deletes a draft listing with confirmation and loading state management.
   * @param draftListingId ID of the draft listing to delete
   * @returns Promise<boolean> - true if deleted successfully, false if cancelled or failed
   */
  async function deleteDraftListing(draftListingId: number): Promise<boolean> {
    // Check if already deleting
    if (deletingIds.value.has(draftListingId)) return false;
    
    // Show confirmation dialog
    const confirmDelete = confirm('Are you sure you want to delete this draft listing? This action cannot be undone.');
    if (!confirmDelete) return false;

    // Add to deleting set
    deletingIds.value.add(draftListingId);

    try {
      await useRequestFetch()<DraftListing>(`/api/draft-listings/${draftListingId}`, {
        method: "DELETE",
      });
      
      // Refresh the draft listings after successful deletion
      await refreshDraftListings();
      showToast("Draft listing deleted successfully", { type: "success" });
      return true;
    } catch (error) {
      showToast("Failed to delete draft listing. Please try again.", { type: "error" });
      console.error("Error deleting draft listing:", error);
      return false;
    } finally {
      // Always remove from deleting set
      deletingIds.value.delete(draftListingId);
    }
  }

  /**
   * Check if a draft listing is currently being deleted
   * @param draftListingId ID of the draft listing to check
   * @returns boolean - true if currently being deleted
   */
  const isDraftDeleting = (draftListingId: number): boolean => {
    return deletingIds.value.has(draftListingId);
  }

  /**
   * Generic function to update any step of a listing (draft or live)
   * @param listing - The listing being edited (draft or live)
   * @param endpoint - API endpoint (e.g. 'one', 'two', 'three', 'four', 'five')
   * @param stepData - Data for the step
   */
  async function updateListingStep(listing: EditableListing, endpoint: string, stepData: any) {
    try {
      const isDraft = isDraftListing(listing);
      const apiPath = isDraft
        ? `/api/draft-listings/update/steps/${endpoint}/`
        : `/api/listings/update/steps/${endpoint}/`;
      
      const idKey = isDraft ? 'draftId' : 'listingId';
      
      await useRequestFetch()<DraftListing | Listing>(apiPath, {
        method: "PATCH",
        body: {
          [idKey]: listing.id,
          ...stepData,
        },
      });
      
      // Refresh the cache to get updated data
      if (isDraft) {
        await refreshDraftListings();
      }
      // Note: For live listings, the caller should refresh their own data
    } catch (error: any) {
      throw createError({
        statusCode: error?.response?.status || 500,
        statusMessage: error?.response?.statusText || "Failed to update listing",
        data: error?.response?._data || error
      });
    }
  }

  /**
   * Updates the first step of a listing.
   * @param listing The listing to update (draft or live)
   * @param stepData Data for the first step
   */
  async function updateStepOne(listing: EditableListing, stepData: StepOne) {
    return updateListingStep(listing, 'one', stepData);
  }

  /**
   * Updates the second step of a listing.
   * @param listing The listing to update (draft or live)
   * @param stepData Data for the second step
   */
  async function updateStepTwo(listing: EditableListing, stepData: StepTwo) {
    return updateListingStep(listing, 'two', stepData);
  }

  /**
   * Updates the third step of a listing.
   * @param listing The listing to update (draft or live)
   * @param stepData Data for the third step
   */
  async function updateStepThree(listing: EditableListing, stepData: StepThree) {
    return updateListingStep(listing, 'three', stepData);
  }

  /**
   * Updates the fourth step of a listing.
   * @param listing The listing to update (draft or live)
   * @param stepData Data for the fourth step
   */
  async function updateStepFour(listing: EditableListing, stepData: StepFour) {
    return updateListingStep(listing, 'four', stepData);
  }

  /**
   * Updates the fifth step of a listing.
   * @param listing The listing to update (draft or live)
   * @param stepData Data for the fifth step
   */
  async function updateStepFive(listing: EditableListing, stepData: StepFive) {
    return updateListingStep(listing, 'five', stepData);
  }

  /**
   * Updates the sixth step of a listing.
   * @param listing The listing to update (draft or live)
   * @param stepData Data for the sixth step
   */
  async function updateStepSix(listing: EditableListing, stepData: StepSix) {
    return updateListingStep(listing, 'six', stepData);
  }

  /**
   * Updates the seventh step of a listing.
   * @param listing The listing to update (draft or live)
   * @param stepData Data for the seventh step
   */
  async function updateStepSeven(listing: EditableListing, stepData: StepSeven) {
    return updateListingStep(listing, 'seven', stepData);
  }

  /**
   * Updates the eighth step of a listing.
   * @param listing The listing to update (draft or live)
   * @param stepData Data for the eighth step
   */
  async function updateStepEight(listing: EditableListing, stepData: StepEight) {
    return updateListingStep(listing, 'eight', stepData);
  }

  /**
   * Updates the ninth step of a listing.
   * @param listing The listing to update (draft or live)
   * @param stepData Data for the ninth step
   */
  async function updateStepNine(listing: EditableListing, stepData: StepNine) {
    return updateListingStep(listing, 'nine', stepData);
  }

  /**
   * Updates the tenth step of a listing.
   * @param listing The listing to update (draft or live)
   * @param stepData Data for the tenth step
   */
  async function updateStepTen(listing: EditableListing, stepData: StepTen) {
    return updateListingStep(listing, 'ten', stepData);
  }

  /**
   * Marks a step as completed for a draft listing (updates local cache)
   * @param draftId ID of the draft listing
   * @param stepNumber Step number to mark as completed (1-10)
   */
  function markStepAsCompleted(draftId: number, stepNumber: number) {
    if (!draftListings.value) return;
    
    const draft = draftListings.value.find(d => d.id === draftId);
    if (!draft) return;
    
    // Only add if not already completed
    if (!draft.completedSteps.includes(stepNumber)) {
      draft.completedSteps.push(stepNumber);
    }
  }

  return {
    // Data
    draftListings,
    draftListing,
    draftListingsPending,
    refreshDraftListings,
    
    // Draft-specific operations
    createDraftListing,
    deleteDraftListing,
    isDraftDeleting,
    markStepAsCompleted,
    
    // Generic update functions (work with both draft and live listings)
    updateListingStep,
    updateStepOne,
    updateStepTwo,
    updateStepThree,
    updateStepFour,
    updateStepFive,
    updateStepSix,
    updateStepSeven,
    updateStepEight,
    updateStepNine,
    updateStepTen,
  };
});
