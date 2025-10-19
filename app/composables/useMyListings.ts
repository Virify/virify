import { createSharedComposable, useDebounceFn } from "@vueuse/core";

type StatusFilter = "all" | "active" | "inactive" | "draft" | "archived";
type SortBy = "new" | "old" | "premium" | "featured" | "basic";

export const useMyListings = createSharedComposable(() => {
  const { loggedIn } = useUserSession();
  const { showToast } = useToast();

  // Query state
  const searchTerm = ref("");
  const statusFilter = ref<StatusFilter>("all");
  const sortBy = ref<SortBy>("new");
  const take = 50;
  const page = ref(1);

  // Data state
  const listings = ref<OwnedListingWithAnalytics[]>([]);
  const loading = ref(false);
  const ended = ref(false);

  const requestFetch = useRequestFetch();

  async function fetchPage(reset = false) {
    if (!loggedIn.value) {
      listings.value = []
      ended.value = true
      return
    }
    
    if (loading.value || (!reset && ended.value)) return

    if (reset) {
      page.value = 1
      ended.value = false
      listings.value = []
    }

    loading.value = true
    
    try {
      const data = await requestFetch<OwnedListingWithAnalytics[]>("/api/user/my-listings/", {
        query: {
          status: statusFilter.value,
          search: searchTerm.value.trim() || undefined,
          page: page.value,
          take,
          sort: sortBy.value,
        },
      })
      
      const list = Array.isArray(data) ? data : []
      listings.value = reset ? list : [...listings.value, ...list]
      
      if (list.length < take) {
        ended.value = true
      } else {
        page.value += 1
      }
    } finally {
      loading.value = false
    }
  }

  const debouncedRefetch = useDebounceFn(() => fetchPage(true), 350)

  watch([statusFilter, loggedIn, sortBy], () => {
    fetchPage(true)
  })

  watch(searchTerm, () => {
    debouncedRefetch()
  })

  onMounted(() => {
    fetchPage(true)
  })

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
        statusFilter.value === "all" ||
        (statusFilter.value === "active" && updatedListing.published) ||
        (statusFilter.value === "inactive" && !updatedListing.published && !updatedListing.isDraft) ||
        (statusFilter.value === "draft" && updatedListing.isDraft)

      if (shouldKeepListing) {
        listings.value[listingIndex] = updatedListing
      } else {
        listings.value.splice(listingIndex, 1)
      }

      showToast(
        published ? "Listing published" : "Listing unpublished", 
        { type: "success" }
      )
    } catch (error) {
      console.error("Failed to update publish state", error)
      showToast("Failed to update publish state", { type: "error" })
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
      }

      showToast("Listing archived successfully", { type: "success" })
    } catch (error) {
      console.error("Failed to archive listing", error)
      showToast("Failed to archive listing", { type: "error" })
      throw error
    }
  }

  function loadMore() {
    return fetchPage(false)
  }

  function refreshList() {
    return fetchPage(true)
  }

  async function getRecentListings(limit = 5) {
    if (!loggedIn.value) return []
    
    try {
      const data = await requestFetch<OwnedListingWithAnalytics[]>("/api/user/my-listings/", {
        query: {
          status: "all",
          page: 1,
          take: limit,
          sort: "new",
        },
      })
      
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error("Failed to fetch recent listings:", error)
      return []
    }
  }

  async function getAllListingsForAnalytics() {
    if (!loggedIn.value) return []
    
    try {
      // Fetch with a very high limit to get all listings for analytics
      const data = await requestFetch<OwnedListingWithAnalytics[]>("/api/user/my-listings/", {
        query: {
          status: "all",
          page: 1,
          take: 10000, // High limit to get all listings
          sort: "new",
        },
      })
      
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error("Failed to fetch all listings for analytics:", error)
      return []
    }
  }

  const hasMore = computed(() => !ended.value && !loading.value)

  return {
    listings,
    loading,
    hasMore,
    loadMore,
    refreshList,
    searchTerm,
    statusFilter,
    sortBy,
    setPublished,
    togglePublished,
    archiveListing,
    getRecentListings,
    getAllListingsForAnalytics,
  };
});
