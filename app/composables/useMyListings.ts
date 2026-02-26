import { createSharedComposable } from "@vueuse/core";

type StatusFilter = "all" | "active" | "inactive" | "draft" | "archived";
type SortBy = "new" | "old" | "premium" | "featured" | "basic";

type SaleRentFilter = "all" | "sale" | "rent";

export const useMyListings = createSharedComposable(() => {
  const { loggedIn } = useUserSession();
  const toast = useToast();

  // Pagination state for dashboard
  const total = ref(0);
  const loading = ref(false);

  // Use for dashboard pages with pagination
  const listings = ref<OwnedListingWithAnalytics[]>([]);

  // Track current pagination state for refetching after add/remove
  const currentFilter = ref<'all' | 'active' | 'inactive' | 'draft' | 'archived'>('all');
  const currentSaleRentFilter = ref<SaleRentFilter>('all');
  const currentPage = ref(1);
  const currentSort = ref<SortBy>('new');
  const currentLimit = ref(20);

  const requestFetch = useRequestFetch();

  /**
   * Fetch listings with pagination, sort, and filter (for dashboard)
   */
  async function fetchMyListings(
    filter: StatusFilter = 'all',
    page: number = 1,
    sort: SortBy = 'new',
    limit: number = 20,
    saleRent: SaleRentFilter = 'all'
  ) {
    // Store current pagination state
    currentFilter.value = filter;
    currentSaleRentFilter.value = saleRent;
    currentPage.value = page;
    currentSort.value = sort;
    currentLimit.value = limit;

    loading.value = true;
    try {
      const data = await requestFetch<{ listings: OwnedListingWithAnalytics[], total: number }>(
        `/api/user/my-listings/?status=${filter}&sort=${sort}&page=${page}&take=${limit}&saleRent=${saleRent}`
      );
      listings.value = data.listings || [];
      total.value = data.total || 0;
    } catch (error) {
      console.error('Error fetching my listings:', error);
      listings.value = [];
      total.value = 0;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Refetch current page (used after add/remove when dashboard is active)
   */
  async function refetchCurrentPage() {
    if (listings.value.length > 0 || total.value > 0) {
      await fetchMyListings(currentFilter.value, currentPage.value, currentSort.value, currentLimit.value, currentSaleRentFilter.value);
    }
  }

  async function setPublished(listingId: number, published: boolean) {
    try {
      await $fetch(`/api/user/my-listings/${listingId}`, { 
        method: "POST", 
        body: { published } 
      })
      
      // Update local state
      const listingIndex = listings.value.findIndex((listing) => listing.id === listingId)
      if (listingIndex === -1) return

      const existingListing = listings.value[listingIndex]
      if (!existingListing) return
      
      const updatedListing: OwnedListingWithAnalytics = {
        ...existingListing,
        published,
        isDraft: published ? false : existingListing.isDraft
      }

      // Check if listing should remain visible based on current filter
      const shouldKeepListing = 
        currentFilter.value === "all" ||
        (currentFilter.value === "active" && updatedListing.published) ||
        (currentFilter.value === "inactive" && !updatedListing.published && !updatedListing.isDraft) ||
        (currentFilter.value === "draft" && updatedListing.isDraft)

      if (shouldKeepListing) {
        listings.value[listingIndex] = updatedListing
      } else {
        listings.value.splice(listingIndex, 1)
        total.value -= 1
      }

      toast.add({
        title: 'Success',
        description: published ? "Listing published" : "Listing unpublished", 
        color: 'success',
      })
    } catch (error) {
      console.error("Failed to update publish state", error)
      toast.add({ title: 'Error', description: "Failed to update publish state", color: 'error' })
      throw error
    }
  }

  function togglePublished(listingId: number, current: boolean) {
    return setPublished(listingId, !current)
  }

  async function archiveListing(listingId: number) {
    try {
      await $fetch(`/api/user/my-listings/${listingId}`, { 
        method: "DELETE"
      })
      
      // Remove from local state
      const listingIndex = listings.value.findIndex((listing) => listing.id === listingId)
      if (listingIndex !== -1) {
        listings.value.splice(listingIndex, 1)
        total.value -= 1
      }

      toast.add({ title: 'Success', description: "Listing archived successfully", color: "success" })
    } catch (error) {
      console.error("Failed to archive listing", error)
      toast.add({ title: "Failed to archive listing", description: "Failed to archive listing", color: "error" })
      throw error
    }
  }

  async function getRecentListings(limit = 5) {
    if (!loggedIn.value) return []
    
    try {
      const data = await requestFetch<{ listings: OwnedListingWithAnalytics[] }>(
        `/api/user/my-listings/?status=all&page=1&take=${limit}&sort=new`
      )
      
      return data.listings || []
    } catch (error) {
      console.error("Failed to fetch recent listings:", error)
      return []
    }
  }

  async function getAllListingsForAnalytics() {
    if (!loggedIn.value) return []
    
    try {
      // Fetch with a very high limit to get all listings for analytics
      const data = await requestFetch<{ listings: OwnedListingWithAnalytics[] }>(
        `/api/user/my-listings/?status=all&page=1&take=10000&sort=new`
      )
      
      return data.listings || []
    } catch (error) {
      console.error("Failed to fetch all listings for analytics:", error)
      return []
    }
  }

  return {
    listings,
    loading,
    total,
    fetchMyListings,
    refetchCurrentPage,
    setPublished,
    togglePublished,
    archiveListing,
    getRecentListings,
    getAllListingsForAnalytics,
  };
});
