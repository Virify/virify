/**
 * Composable for tracking analytics events like listing views
 */
import { nanoid } from 'nanoid'
import type { TrackListingViewBody } from '../../../shared/types/analytics'

/**
 * Analytics tracking composable
 * Provides methods for tracking user interactions and events
 */
export function useAnalytics() {
  const sessionId = useState('analytics-session-id', () => nanoid())

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
      navigator.sendBeacon('/api/analytics/track-listing-view', blob)
    } catch (error) {
      // Silently fail to not disturb user experience
      console.error('Failed to track listing view:', error)
    }
  }
  
  /**
   * Get the current user's analytics data
   * @returns Analytics data for the current user's listings
   */
  const getUserAnalytics = async () => {
    try {
      return await $fetch('/api/analytics/user-listings')
    } catch (error) {
      console.error('Failed to fetch user analytics:', error)
      return {
        totalViews: 0,
        previousMonthViews: 0,
        percentageChange: 0,
        favoritedByOthersCount: 0,
        totalConversations: 0,
      }
    }
  }
  
  return {
    trackListingView,
    getUserAnalytics
  }
}
