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
  const analytics = ref<UserAnalyticsSummary | null>(null);
  
  const { data: trendingLocations } = useAsyncData("trending-locations", () => useRequestFetch()<TrendingLocation[]>("/api/analytics/search/location"), {
    immediate: true,
  });
  const { favourites, refreshFavourites } = useFavourites();
  const { userNotes, refreshUserNotes } = useNotes();
  const { getAllListingsForAnalytics } = useMyListings();
  
  // Add state for all listings analytics data
  const allUserListings = ref<OwnedListingWithAnalytics[]>([]);
  
  // Fetch ALL analytics data when logged in
  const fetchAnalytics = async () => {
    if (!loggedIn.value) return;
    
    try {
      // Fetch core analytics data
      const [viewedListings, userAnalytics] = await Promise.all([
        useRequestFetch()<RecentlyViewed[]>("/api/analytics/listing/track-view").catch(() => []),
        useRequestFetch()<UserAnalyticsSummary>("/api/analytics/all").catch(() => null)
      ]);
      
      recentlyViewedListings.value = viewedListings;
      analytics.value = userAnalytics;
      
      // Ensure ALL data is fetched from respective composables
      const [allListings] = await Promise.all([
        getAllListingsForAnalytics(), // Load ALL listings for analytics
        refreshFavourites(),          // Load ALL favourites
        refreshUserNotes()            // Load ALL notes  
      ]);
      
      allUserListings.value = allListings;
      
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };
  
  // Auto-fetch when logged in
  if (import.meta.client) {
    watchEffect(() => {
      if (loggedIn.value) {
        fetchAnalytics();
      } else {
        recentlyViewedListings.value = [];
        recentOwnedListings.value = [];
        allUserListings.value = [];
        analytics.value = null;
      }
    });
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
    query: string;
    location: GeocodingFeature;
    radius: number;
    resultCount: number;
    userId?: number;
  }) => {
    console.log("trackSearch called with:", { 
      query: params.query, 
      location: params.location.text,
      radius: params.radius,
      resultCount: params.resultCount 
    });
    
    try {
      const payload = {
        query: params.query,
        location: params.location,
        radius: params.radius,
        resultCount: params.resultCount,
        userId: params.userId,
      };
      
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      const success = navigator.sendBeacon("/api/analytics/search", blob);
      console.log("Search tracking:", success ? "queued" : "failed to queue");
      
      if (!success) {
        console.warn("sendBeacon failed, falling back to fetch");
        await $fetch("/api/analytics/search", {
          method: "POST",
          body: payload,
        });
      }
    } catch (error) {
      console.error("Failed to track search:", error);
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
      console.log("Mortgage calculation tracking:", success ? "queued" : "failed to queue");
    } catch (error) {
      console.error("Failed to track mortgage calculation:", error);
    }
  };

  return {
    analytics,
    trackListingView,
    trackMortgageCalculation,
    favourites,
    userNotes,
    recentlyViewedListings,
    recentOwnedListings,
    allUserListings,
    trackSearch,
    trendingLocations,
    fetchAnalytics,
  };
});
