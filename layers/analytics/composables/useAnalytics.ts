/**
 * Composable for tracking analytics events and business intelligence
 * Pure analytics functionality - separate from user notifications
 */
import { nanoid } from "nanoid";

/**
 * Analytics tracking composable
 * Provides methods for tracking user interactions and business analytics
 * Note: User notification counts are handled by the notifications layer
 */
export function useAnalytics() {
  const sessionId = useState("analytics-session-id", () => nanoid());
  const { data: recentlyViewedListings } = useAsyncData("recently-viewed-listings", () => useRequestFetch()<number[]>("/api/analytics/listing/track-view"));
  const { data: analytics } = useAsyncData("user-analytics", () => useRequestFetch()<UserAnalyticsSummary>("/api/analytics/all"));
  const { data: trendingLocations } = useAsyncData("trending-locations", () => useRequestFetch()<TrendingLocation[]>("/api/analytics/ai-search"), {
    immediate: true,
  });
  const { recentFavourites } = useFavourites();
  const { recentUserNotes } = useNotes();
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
        console.log("Unable to access localStorage, fallback to session");
      }

      const listingKey = `listing-${listingId}`;
      const now = Date.now();

      // Only count a view once every 30 minutes per listing
      if (viewHistory[listingKey] && now - viewHistory[listingKey] < 30 * 60 * 1000) {
        console.log("Skipping duplicate view", listingKey);
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
        console.log("Unable to save to localStorage");
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
      navigator.sendBeacon("/api/analytics/ai-search", blob);
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
  };
}
