import { createSharedComposable } from "@vueuse/core";
import type { DraftListingWithFullPayload } from "~~/shared/types/draft";

type SortBy = "new" | "old";

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

  // Pagination state
  const total = ref(0);
  const loading = ref(false);

  // Draft listings state
  const draftListings = ref<DraftListingForCard[]>([]);

  // Track current pagination state for refetching
  const currentPage = ref(1);
  const currentSort = ref<SortBy>('new');
  const currentLimit = ref(20);

  const requestFetch = useRequestFetch();

  /**
   * Transform raw draft listing to card-compatible format
   */
  function transformDraftForCard(draft: DraftListingWithFullPayload): DraftListingForCard {
    return {
      ...draft,
      analytics: {
        viewsCount: 0,
        favouritesCount: 0,
        enquiriesCount: 0,
      },
      published: false,
      archived: false,
      isDraft: true,
      draftId: draft.id,
      publishedAt: null,
    };
  }

  /**
   * Fetch draft listings with pagination and sort
   */
  async function fetchDraftListings(
    page: number = 1,
    sort: SortBy = 'new',
    limit: number = 20
  ) {
    // Store current pagination state
    currentPage.value = page;
    currentSort.value = sort;
    currentLimit.value = limit;

    loading.value = true;
    try {
      const data = await requestFetch<{ drafts: DraftListingWithFullPayload[], total: number }>(
        `/api/user/draft-listings/?sort=${sort}&page=${page}&take=${limit}`
      );
      
      draftListings.value = (data.drafts || []).map(transformDraftForCard);
      total.value = data.total || 0;
    } catch (error) {
      console.error('Error fetching draft listings:', error);
      draftListings.value = [];
      total.value = 0;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Refetch current page (used after delete)
   */
  async function refetchCurrentPage() {
    if (draftListings.value.length > 0 || total.value > 0) {
      await fetchDraftListings(currentPage.value, currentSort.value, currentLimit.value);
    }
  }

  /**
   * Delete a draft listing
   */
  async function deleteDraft(draftId: number) {
    try {
      await requestFetch(`/api/draft-listings/${draftId}`, {
        method: 'DELETE'
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
        title: 'Success', 
        description: "Draft discarded successfully", 
        color: "success" 
      });
    } catch (error) {
      console.error("Failed to delete draft", error);
      toast.add({ 
        title: "Error", 
        description: "Failed to discard draft", 
        color: "error" 
      });
      throw error;
    }
  }

  return {
    draftListings,
    loading,
    total,
    fetchDraftListings,
    refetchCurrentPage,
    deleteDraft,
  };
});
