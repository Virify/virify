import { createSharedComposable } from "@vueuse/core";
import type { DraftListing, ListingTier } from "~~/layers/database/server/database/prisma/generated/client";
import type { StepSeven } from "~~/shared/types/draft";

export const useDraftListing = createSharedComposable(() => {
  const { showToast } = useToast();

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
      const title = `New ${tier.tier.charAt(0).toUpperCase() + tier.tier.slice(1)} Listing`;
      
      const createdListing = await useRequestFetch()<DraftListing>("/api/draft-listings/create/", {
        method: "POST",
        body: {
          tier: tier.tier.toUpperCase() as ListingTier,
          title
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
   * Generic function to update any step of a draft listing
   * @param endpoint - API endpoint (e.g. 'one', 'two', 'three', 'four', 'five')
   * @param draftId - ID of the draft listing to update
   * @param stepData - Data for the step
   */
  async function updateDraftStep(endpoint: string, draftId: number, stepData: any) {
    console.log(`Updating draft step ${endpoint} for draftId:`, draftId, "with data:", stepData);
    try {
      await useRequestFetch()<DraftListing>(`/api/draft-listings/update/steps/${endpoint}/`, {
        method: "PATCH",
        body: {
          draftId,
          ...stepData,
        },
      });
      refreshDraftListings();
    } catch (error: any) {
      // Use Nuxt's createError for proper error handling
      throw createError({
        statusCode: error?.response?.status || 500,
        statusMessage: error?.response?.statusText || "Failed to update draft listing",
        data: error?.response?._data || error
      });
    }
  }

  /**
   * Updates the first step of a draft listing.
   * @param draftId ID of the draft listing to update
   * @param stepData Data for the first step
   */
  async function updateDraftStepOne(draftId: number, stepData: StepOne) {
    return updateDraftStep('one', draftId, stepData);
  };

  /**
   * Updates the second step of a draft listing.
   * @param draftId ID of the draft listing to update
   * @param stepData Data for the second step
   */
  async function updateDraftStepTwo(draftId: number, stepData: StepTwo) {
    return updateDraftStep('two', draftId, stepData);
  }

  /**
   * Updates the third step of a draft listing.
   * @param draftId ID of the draft listing to update
   * @param stepData Data for the third step
   */
  async function updateDraftStepThree(draftId: number, stepData: StepThree) {
    return updateDraftStep('three', draftId, stepData);
  }

  /**
   * Updates the fourth step of a draft listing.
   * @param draftId ID of the draft listing to update
   * @param stepData Data for the fourth step
   */
  async function updateDraftStepFour(draftId: number, stepData: StepFour) {
    return updateDraftStep('four', draftId, stepData);
  }

  /**
   * Updates the fifth step of a draft listing.
   * @param draftId ID of the draft listing to update
   * @param stepData Data for the fifth step
   */
  async function updateDraftStepFive(draftId: number, stepData: StepFive) {
    return updateDraftStep('five', draftId, stepData);
  }

  /**
   * Updates the sixth step of a draft listing.
   * @param draftId ID of the draft listing to update
   * @param stepData Data for the sixth step
   */
  async function updateDraftStepSix(draftId: number, stepData: StepSix) {
    return updateDraftStep('six', draftId, stepData);
  }

  /**
   * Updates the seventh step of a draft listing.
   * @param draftId ID of the draft listing to update
   * @param stepData Data for the seventh step
   */
  async function updateDraftStepSeven(draftId: number, stepData: StepSeven) {
    return updateDraftStep('seven', draftId, stepData);
  }

  /**
   * Updates the eighth step of a draft listing.
   * @param draftId ID of the draft listing to update
   * @param stepData Data for the eighth step
   */
  async function updateDraftStepEight(draftId: number, stepData: StepEight) {
    return updateDraftStep('eight', draftId, stepData);
  }

  /**
   * Updates the ninth step of a draft listing.
   * @param draftId ID of the draft listing to update
   * @param stepData Data for the ninth step
   */
  async function updateDraftStepNine(draftId: number, stepData: StepNine) {
    return updateDraftStep('nine', draftId, stepData);
  }

  return {
    draftListings,
    draftListing,
    draftListingsPending,
    refreshDraftListings,
    createDraftListing,
    deleteDraftListing,
    isDraftDeleting,
    updateDraftStep, // Generic step updater
    updateDraftStepOne,
    updateDraftStepTwo,
    updateDraftStepThree,
    updateDraftStepFour,
    updateDraftStepFive,
    updateDraftStepSix,
    updateDraftStepSeven,
    updateDraftStepEight,
    updateDraftStepNine,
  };
});
