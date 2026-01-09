/**
 * Composable for tracking analytics events and business intelligence
 * Pure analytics functionality - separate from user notifications
 */
import { nanoid } from "nanoid";
import { createSharedComposable } from '@vueuse/core';

/**
 * Analytics tracking composable
 * Provides methods for tracking user interactions and business analytics
 * Note: User notification counts are handled by the notifications layer
 */
export const useAnalytics = createSharedComposable(() => {
  const { loggedIn } = useUserSession();
  const sessionId = useState("analytics-session-id", () => nanoid());
  
  // Reactive state for analytics data
  const recentlyViewedListings = ref<RecentlyViewed[]>([]);
  const recentOwnedListings = ref<OwnedListingWithAnalytics[]>([]);
  // Use state for specific analytics to prevent refreshing on navigation
  const analytics = useState<UserAnalyticsSummary | null>("analytics-user-summary", () => null);
  const allUserListings = ref<OwnedListingWithAnalytics[]>([]);
  
  // Loading states
  const isAnalyticsLoading = useState("analytics-is-loading", () => true);
  // isFavouritesLoading and isNotesLoading are now handled by their respective composables
  const isListingsLoading = ref(true);
  
  const { data: trendingLocations } = useAsyncData("trending-locations", () => useRequestFetch()<TrendingLocation[]>("/api/analytics/search/location"), {
    immediate: true,
  });
  const { getAllListingsForAnalytics } = useMyListings();
  
  // Fetch ALL analytics data when logged in
  const fetchAnalytics = async () => {
    if (!loggedIn.value) return;
    
    // Only show loading state if we don't have data yet
    if (!analytics.value) {
      isAnalyticsLoading.value = true;
    }

    try {
      // Fetch core analytics data
      const [viewedListings, userAnalytics] = await Promise.all([
        useRequestFetch()<RecentlyViewed[]>("/api/analytics/listing/track-view").catch(() => []),
        useRequestFetch()<UserAnalyticsSummary>("/api/analytics/all").catch(() => null)
      ]);
      
      recentlyViewedListings.value = viewedListings;
      analytics.value = userAnalytics;
      isAnalyticsLoading.value = false; // Analytics loaded
      
      // Ensure ALL data is fetched from respective composables
      // Loading states for favourites and notes are handled by their composables
      // Listings loading is handled locally
      (async () => {
        if (allUserListings.value.length === 0) {
          isListingsLoading.value = true;
        }
        try {
          allUserListings.value = await getAllListingsForAnalytics();
        } finally {
          isListingsLoading.value = false;
        }
      })();
      
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      isAnalyticsLoading.value = false;
      isListingsLoading.value = false;
    }
  };
  
  // Auto-fetch when logged in
  if (import.meta.client) {
    watch(loggedIn, (isLoggedIn) => {
      if (isLoggedIn) {
        fetchAnalytics();
      } else {
        recentlyViewedListings.value = [];
        recentOwnedListings.value = [];
        allUserListings.value = [];
        analytics.value = null;
      }
    }, { immediate: true });
  }
  /**
   * !! Important: useRequestFetch is required for SSR authenticated requests
   */

  /**
   * Track when a user views a listing
   * @param listingId ID of the listing being viewed
   */
  const trackListingView = async (listingId: number | string) => {
    try {
      const viewHistoryKey = "listing-view-history";
      let viewHistory: Record<string, number> = {};

      // Try to get existing view history from localStorage
      try {
        const storedHistory = localStorage.getItem(viewHistoryKey);
        if (storedHistory) {
          viewHistory = JSON.parse(storedHistory);
        }
      } catch (e) {
        // Fallback to session if localStorage unavailable
      }

      const listingKey = `listing-${listingId}`;
      const now = Date.now();

      // Only count a view once every 30 minutes per listing
      if (viewHistory[listingKey] && now - viewHistory[listingKey] < 30 * 60 * 1000) {
        return;
      }

      viewHistory = {
        ...viewHistory,
        [listingKey]: now,
      };

      // Save to localStorage immediately to prevent duplicate tracking
      try {
        localStorage.setItem(viewHistoryKey, JSON.stringify(viewHistory));
      } catch (e) {
        // Continue if localStorage save fails
      }

      const payload: TrackListingViewBody = {
        listingId,
        sessionId: sessionId.value,
      };

      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/listing/track-view", blob);
    } catch (error) {
      // Silently fail to not disturb user experience
      console.error("Failed to track listing view:", error);
    }
  };

  const trackSearch = async (params: {
    listingType: ListingType;
    query: string;
    location: GeocodingFeature;
    radius: number;
    resultCount: number;
    userId?: number;
  }) => {
    try {
      const payload = {
        listingType: params.listingType,
        query: params.query,
        location: params.location,
        radius: params.radius,
        resultCount: params.resultCount,
        userId: params.userId,
      };
      
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      const success = navigator.sendBeacon("/api/analytics/search", blob);
      if (!success) {
        try {
          await $fetch("/api/analytics/search", {
            method: "POST",
            body: payload,
          });
        } catch (e) {
          // swallow fallback errors to avoid noisy logs
        }
      }
    } catch (error) {
      // intentionally silent for analytics failures
    }
  };

  /**
   * Track when a user performs a mortgage calculation
   * Uses sendBeacon for fire-and-forget lightweight tracking
   * @param data Mortgage calculation data for analytics
   */
  const trackMortgageCalculation = (data: TrackMortgageCalculationPayload) => {
    try {
      const payload = {
        sessionId: sessionId.value,
        ...data,
      };

      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      const success = navigator.sendBeacon("/api/analytics/mortgage/track", blob);
    } catch (error) {
      console.error("Failed to track mortgage calculation:", error);
    }
  };

  return {
    analytics,
    trackListingView,
    trackMortgageCalculation,
    recentlyViewedListings,
    recentOwnedListings,
    allUserListings,
    trackSearch,
    trendingLocations,
    fetchAnalytics,
    isAnalyticsLoading,
    isListingsLoading,
  };
});
