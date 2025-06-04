/**
 * Composable for tracking analytics events like listing views
 */
import { nanoid } from 'nanoid'
import type { UserAnalyticsSummary, AnalyticsAggregates } from '~~/shared/types/analytics'

/**
 * Analytics tracking composable
 * Provides methods for tracking user interactions and events
 */
export function useAnalytics() {
  const sessionId = useState('analytics-session-id', () => nanoid())

  /**
   * !! Important: useRequestFetch is required for SSR authenticated requests
   */
  const { data: analytics } = useAsyncData('user-analytics', () =>
    useRequestFetch()<UserAnalyticsSummary>('/api/analytics/all'))

  /**
   * Analytics aggregates (formerly account counts)
   */
  const aggregates = ref<AnalyticsAggregates>({});
  const aggregatesLoading = ref(false);
  const aggregatesError = ref<Error | null>(null);

  /**
   * Fetch analytics aggregates from the API
   */
  async function fetchAnalyticsAggregates() {
    aggregatesLoading.value = true;
    aggregatesError.value = null;

    try {
      const data = await $fetch<AnalyticsAggregates>('/api/analytics/aggregates');
      aggregates.value = data;
    } catch (err) {
      console.error('Failed to fetch analytics aggregates:', err);
      aggregatesError.value = err as Error;
    } finally {
      aggregatesLoading.value = false;
    }
  }

  /**
   * Get aggregate count for a specific category
   * @param key - The category key 
   * @returns The count for the category or undefined
   */
  function getAggregateCount(key?: string): number | undefined {
    if (!key) return undefined;
    return aggregates.value[key as keyof AnalyticsAggregates];
  }

  /**
   * Track when a user views a listing
   * @param listingId ID of the listing being viewed
   */
  const trackListingView = async (listingId: number | string) => {
    try {
      const viewHistoryKey = 'listing-view-history';
      let viewHistory: Record<string, number> = {};
      
      // Try to get existing view history from localStorage
      try {
        const storedHistory = localStorage.getItem(viewHistoryKey);
        if (storedHistory) {
          viewHistory = JSON.parse(storedHistory);
        }
      } catch (e) {
        console.log('Unable to access localStorage, fallback to session');
      }
      
      const listingKey = `listing-${listingId}`;
      const now = Date.now();
      
      // Only count a view once every 30 minutes per listing
      if (viewHistory[listingKey] && now - viewHistory[listingKey] < 30 * 60 * 1000) {
        console.log('Skipping duplicate view', listingKey);
        return;
      }
    
      viewHistory = {
        ...viewHistory,
        [listingKey]: now
      };
      
      // Save to localStorage immediately to prevent duplicate tracking
      try {
        localStorage.setItem(viewHistoryKey, JSON.stringify(viewHistory));
      } catch (e) {
        console.log('Unable to save to localStorage');
      }
      
      const payload: TrackListingViewBody = {
        listingId,
        sessionId: sessionId.value
      };
      
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/listing/track-view', blob)
    } catch (error) {
      // Silently fail to not disturb user experience
      console.error('Failed to track listing view:', error)
    }
  }
  
  return {
    analytics,
    trackListingView,
    aggregates,
    aggregatesLoading,
    aggregatesError,
    fetchAnalyticsAggregates,
    getAggregateCount,
  }
}
