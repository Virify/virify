import { createSharedComposable } from "@vueuse/core";
import type { RentalAvailabilityStatus, SaleAvailabilityStatus } from "~~/layers/database/server/database/prisma/generated/enums";

type StatusFilter = "all" | "active" | "inactive" | "draft" | "archived";
type SortBy = "new" | "old" | "premium" | "featured" | "basic";

type SaleRentFilter = "all" | "sale" | "rent";

export const useMyListings = createSharedComposable(() => {
  const { loggedIn } = useUserSession();
  const toast = useToast();

  // Shared refs populated by the my-listings page's useAsyncData handler
  const total = ref(0);
  const listings = ref<OwnedListingWithAnalytics[]>([]);

  const requestFetch = useRequestFetch();

  async function setPublished(listingId: number, published: boolean) {
    try {
      await requestFetch(`/api/user/my-listings/${listingId}`, {
        method: "POST",
        body: { published },
      });

      // Update local state
      const listingIndex = listings.value.findIndex((listing) => listing.id === listingId);
      if (listingIndex === -1) return;

      const existingListing = listings.value[listingIndex];
      if (!existingListing) return;

      const updatedListing: OwnedListingWithAnalytics = {
        ...existingListing,
        published,
        isDraft: published ? false : existingListing.isDraft,
      };

      listings.value[listingIndex] = updatedListing;

      toast.add({
        title: "Success",
        description: published ? "Listing published" : "Listing unpublished",
        color: "success",
        icon: "i-lucide-check-circle",
      });

      const { fetchUserItemsAggregates } = useNotifications();
      fetchUserItemsAggregates(true).catch(() => {});
    } catch (error) {
      console.error("Failed to update publish state", error);
      toast.add({ title: "Error", description: "Failed to update publish state", color: "error", icon: "i-lucide-circle-x" });
      throw error;
    }
  }

  function togglePublished(listingId: number, current: boolean) {
    return setPublished(listingId, !current);
  }

  async function setAvailabilityStatus(listingId: number, availabilityStatus: AvailabilityOptions) {
    await requestFetch(`/api/user/my-listings/${listingId}/availability`, {
      method: "PATCH",
      body: { availabilityStatus },
    });

    // Update local state optimistically
    const listing = listings.value.find((l) => l.id === listingId);
    if (listing?.saleListing) {
      listing.saleListing.availabilityStatus = availabilityStatus as SaleAvailabilityStatus;
    } else if (listing?.rentalListing) {
      listing.rentalListing.availabilityStatus = availabilityStatus as RentalAvailabilityStatus;
    }
  }

  async function archiveListing(listingId: number) {
    try {
      await requestFetch(`/api/user/my-listings/${listingId}`, {
        method: "DELETE",
      });

      // Remove from local state
      const listingIndex = listings.value.findIndex((listing) => listing.id === listingId);
      if (listingIndex !== -1) {
        listings.value.splice(listingIndex, 1);
        total.value -= 1;
      }

      toast.add({ title: "Success", description: "Listing archived successfully", color: "success", icon: "i-lucide-archive" });
    } catch (error) {
      console.error("Failed to archive listing", error);
      toast.add({ title: "Failed to archive listing", description: "Failed to archive listing", color: "error", icon: "i-lucide-circle-x" });
      throw error;
    }
  }

  /**
   * Restores an archived listing back to My Listings (unpublished, not archived).
   */
  async function restoreListing(listingId: number): Promise<void> {
    await requestFetch("/api/listing/restore", {
      method: "POST",
      body: { listingId },
    });

    // Remove from local archived listings view
    const idx = listings.value.findIndex((l) => l.id === listingId);
    if (idx !== -1) {
      listings.value.splice(idx, 1);
      total.value -= 1;
    }

    toast.add({ title: "Listing restored", description: "Your listing is back in My Listings (unpublished)", color: "success", icon: "i-lucide-rotate-ccw" });
  }

  async function getRecentListings(limit = 5) {
    if (!loggedIn.value) return [];

    try {
      const data = await requestFetch<{ listings: OwnedListingWithAnalytics[] }>(`/api/user/my-listings/?status=all&page=1&take=${limit}&sort=new`);

      return data.listings || [];
    } catch (error) {
      console.error("Failed to fetch recent listings:", error);
      return [];
    }
  }

  async function getAllListingsForAnalytics() {
    if (!loggedIn.value) return [];

    try {
      // Fetch with a very high limit to get all listings for analytics
      const data = await requestFetch<{ listings: OwnedListingWithAnalytics[] }>(`/api/user/my-listings/?status=all&page=1&take=10000&sort=new`);

      return data.listings || [];
    } catch (error) {
      console.error("Failed to fetch all listings for analytics:", error);
      return [];
    }
  }

  return {
    listings,
    total,
    setPublished,
    togglePublished,
    setAvailabilityStatus,
    archiveListing,
    restoreListing,
    getRecentListings,
    getAllListingsForAnalytics,
  };
});
