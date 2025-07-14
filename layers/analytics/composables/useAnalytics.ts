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
  const recentlyViewedListings = ref<number[]>([]);
  const analytics = ref<UserAnalyticsSummary | null>(null);
  
  const { data: trendingLocations } = useAsyncData("trending-locations", () => useRequestFetch()<TrendingLocation[]>("/api/analytics/search/location"), {
    immediate: true,
  });
  const { recentFavourites } = useFavourites();
  const { recentUserNotes } = useNotes();
  
  // Fetch analytics data when logged in
  const fetchAnalytics = async () => {
    if (!loggedIn.value) return;
    
    try {
      const [viewedListings, userAnalytics] = await Promise.all([
        useRequestFetch()<number[]>("/api/analytics/listing/track-view").catch(() => []),
        useRequestFetch()<UserAnalyticsSummary>("/api/analytics/all").catch(() => null)
      ]);
      
      recentlyViewedListings.value = viewedListings;
      analytics.value = userAnalytics;
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

  const trackAiSearch = async (aiQuery: string, location: GeocodingFeature) => {
    try {
      const payload: { aiQuery: string; location: GeocodingFeature } = {
        aiQuery,
        location,
      };

      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/search", blob);
    } catch (error) {
      console.error("Failed to track AI search:", error);
    }
  };

  return {
    analytics,
    trackListingView,
    recentFavourites,
    recentUserNotes,
    recentlyViewedListings,
    trackAiSearch,
    trendingLocations,
    fetchAnalytics,
  };
});
