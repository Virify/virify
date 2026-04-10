import { createSharedComposable } from "@vueuse/core";
import type { DraftListingWithFullPayload } from "~~/shared/types/draft";

/**
 * Draft listing with analytics-like structure for MyListingCard compatibility
 */
export type DraftListingForCard = DraftListingWithFullPayload & {
  analytics: {
    viewsCount: number;
    favouritesCount: number;
    enquiriesCount: number;
  };
  published: false;
  archived: false;
  isDraft: true;
  draftId: number;
  publishedAt: null;
};

export const useDraftListings = createSharedComposable(() => {
  const toast = useToast();

  // Shared refs populated by the draft-listings page's useAsyncData handler
  const total = ref(0);
  const draftListings = ref<DraftListingForCard[]>([]);

  const requestFetch = useRequestFetch();

  async function deleteDraft(draftId: number) {
    try {
      await requestFetch(`/api/draft-listings/${draftId}`, {
        method: "DELETE",
      });

      // Remove from local state
      const draftIndex = draftListings.value.findIndex((d) => d.id === draftId);
      if (draftIndex !== -1) {
        draftListings.value.splice(draftIndex, 1);
        total.value -= 1;
      }

      // Update aggregates
      const { fetchUserItemsAggregates } = useNotifications();
      fetchUserItemsAggregates(true);

      toast.add({
        title: "Success",
        description: "Draft discarded successfully",
        color: "success",
        icon: "i-lucide-trash-2",
      });
    } catch (error) {
      console.error("Failed to delete draft", error);
      toast.add({
        title: "Error",
        description: "Failed to discard draft",
        color: "error",
        icon: "i-lucide-circle-x",
      });
      throw error;
    }
  }

  return {
    draftListings,
    total,
    deleteDraft,
  };
});
