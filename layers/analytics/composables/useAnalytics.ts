/**
 * Composable for tracking analytics events and business intelligence
 * Pure analytics functionality - separate from user notifications
 * 
 * Also orchestrates fetching of recent data (favourites, notes) for dashboard
 * 
 * TWO MODES:
 * - Quick analytics: Lightweight data for dashboard homepage (fast)
 * - Comprehensive analytics: Full data with time-series for analytics page (detailed)
 */
import { nanoid } from "nanoid";
import { createSharedComposable } from '@vueuse/core';

/**
 * Analytics tracking composable
 * Provides methods for tracking user interactions and business analytics
 * Also coordinates fetching of recent favourites/notes for dashboard homepage
 * Note: User notification counts are handled by the notifications layer
 */
export const useAnalytics = createSharedComposable(() => {
  const { loggedIn } = useUserSession();
  
  // Get refresh functions from recent items composable (Singleton)
  const { 
    refreshRecentFavourites, 
    recentFavourites,
    recentFavouritesStatus,
    refreshRecentNotes,
    recentUserNotes,
    recentNotesStatus
  } = useDashboardRecentItems();
  
  // Reactive state for analytics data
  const recentlyViewedListings = ref<RecentlyViewed[]>([]);
  const recentOwnedListings = ref<OwnedListingWithAnalytics[]>([]);
  // Use state for specific analytics to prevent refreshing on navigation
  const analytics = useState<UserAnalyticsSummary | null>("analytics-user-summary", () => null);
  const allUserListings = ref<OwnedListingWithAnalytics[]>([]);
  
  // Quick analytics for dashboard homepage (lightweight)
  const quickAnalytics = useState<QuickAnalytics | null>("analytics-quick", () => null);
  const isQuickLoading = useState("analytics-quick-loading", () => false);
  
  // Comprehensive analytics for full analytics page
  const comprehensiveAnalytics = useState<ComprehensiveAnalytics | null>("analytics-comprehensive", () => null);
  const isComprehensiveLoading = useState("analytics-comprehensive-loading", () => false);
  const selectedPeriod = useState<'7d' | '30d' | '90d'>("analytics-period", () => '30d');
  const selectedListingId = useState<number | null>("analytics-listing-id", () => null);
  
  // Loading states
  const isAnalyticsLoading = useState("analytics-is-loading", () => true);
  // isFavouritesLoading and isNotesLoading are now handled by their respective composables
  const isListingsLoading = ref(true);
  
  const { data: trendingLocations } = useAsyncData("trending-locations", () => useRequestFetch()<TrendingLocation[]>("/api/analytics/search/location"), {
    immediate: true,
  });
  const { getAllListingsForAnalytics } = useMyListings();
  
  /**
   * Fetch QUICK analytics for dashboard homepage
   * Lightweight - just totals and last 7 days
   */
  const fetchQuickAnalytics = async () => {
    if (!loggedIn.value) return;
    
    if (!quickAnalytics.value) {
      isQuickLoading.value = true;
    }
    
    try {
      const data = await useRequestFetch()<QuickAnalytics>("/api/analytics/quick");
      quickAnalytics.value = data;
    } catch (error) {
      console.error('Failed to fetch quick analytics:', error);
    } finally {
      isQuickLoading.value = false;
    }
  };
  
  /**
   * Fetch COMPREHENSIVE analytics for full analytics page
   * Includes time-series, per-listing breakdowns, traffic sources
   */
  const fetchComprehensiveAnalytics = async (
    period?: '7d' | '30d' | '90d',
    listingId: number | null = selectedListingId.value,
  ) => {
    if (!loggedIn.value) return;
    
    const fetchPeriod = period || selectedPeriod.value;
    selectedPeriod.value = fetchPeriod;
    selectedListingId.value = listingId;
    
    isComprehensiveLoading.value = true;
    
    try {
      const params = new URLSearchParams({ period: fetchPeriod });
      if (listingId) {
        params.set("listingId", String(listingId));
      }

      const data = await useRequestFetch()<ComprehensiveAnalytics>(
        `/api/analytics/comprehensive?${params.toString()}`
      );
      comprehensiveAnalytics.value = data;
    } catch (error) {
      console.error('Failed to fetch comprehensive analytics:', error);
    } finally {
      isComprehensiveLoading.value = false;
    }
  };
  
  /**
   * Fetch ALL analytics and recent data when logged in
   * Orchestrates fetching of:
   * - Recently viewed listings
   * - User analytics summary
   * - Recent favourites (via useFavourites)
   * - Recent notes (via useNotes)
   * - User's own listings
   */
  const fetchAnalytics = async () => {
    if (!loggedIn.value) return;
    
    // Only show loading state if we don't have data yet
    if (!analytics.value) {
      isAnalyticsLoading.value = true;
    }

    try {
      // Fetch core analytics data + trigger recent favourites/notes refresh
      const [viewedListings, userAnalytics] = await Promise.all([
        useRequestFetch()<RecentlyViewed[]>("/api/analytics/listing/track-view").catch(() => []),
        useRequestFetch()<UserAnalyticsSummary>("/api/analytics/all").catch(() => null),
        // Also refresh recent favourites and notes
        refreshRecentFavourites(),
        refreshRecentNotes(),
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

  return {
    analytics,
    recentlyViewedListings,
    recentOwnedListings,
    allUserListings,
    trendingLocations,
    fetchAnalytics,
    isAnalyticsLoading,
    isListingsLoading,
    // Recent data from other composables (centralized access for dashboard)
    recentFavourites,
    recentUserNotes,
    recentFavouritesStatus,
    recentNotesStatus,
    refreshRecentFavourites,
    refreshRecentNotes,
    // NEW: Quick analytics (dashboard homepage)
    quickAnalytics,
    isQuickLoading,
    fetchQuickAnalytics,
    // NEW: Comprehensive analytics (full analytics page)
    comprehensiveAnalytics,
    isComprehensiveLoading,
    selectedPeriod,
    selectedListingId,
    fetchComprehensiveAnalytics,
  };
});
