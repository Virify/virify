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
  // Use a session ID to track unique views within a session
  const sessionId = useState('analytics-session-id', () => nanoid())

  /**
   * Track when a user views a listing
   * @param listingId ID of the listing being viewed
   */
  const trackListingView = async (listingId: number | string) => {
    try {
      // Debounce views to avoid over-counting when users reload or navigate back and forth
      const viewHistory = useState<Record<string, number>>('listing-view-history', () => ({}))
      const listingKey = `listing-${listingId}`
      const now = Date.now()
      
      // Only count a view once every 30 minutes per listing
      if (viewHistory.value[listingKey] && now - viewHistory.value[listingKey] < 30 * 60 * 1000) {
        return
      }
      
      // Update view history
      viewHistory.value = {
        ...viewHistory.value,
        [listingKey]: now
      }
      
      // Create payload
      const payload: TrackListingViewBody = {
        listingId,
        sessionId: sessionId.value
      }
      
      // Track the view using SendBeacon API for better reliability
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
      navigator.sendBeacon('/api/analytics/user-listing-view', blob)
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
      return await $fetch('/api/analytics/user-listing-views')
    } catch (error) {
      console.error('Failed to fetch user analytics:', error)
      return {
        totalViews: 0,
        previousMonthViews: 0,
        percentageChange: 0
      }
    }
  }
  
  return {
    trackListingView,
    getUserAnalytics
  }
}
