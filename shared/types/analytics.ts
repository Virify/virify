/**
 * Types related to analytics functionality
 */

/**
 * Analytics event interface
 */
export interface AnalyticsEvent {
  eventType: string;
  timestamp: Date;
  userId?: number | null;
  sessionId?: string | null;
  metadata: Record<string, any>;
}

/**
 * Listing view event interface
 */
export interface ListingViewEvent extends AnalyticsEvent {
  eventType: 'listing_view';
  metadata: {
    listingId: number;
  };
}

/**
 * Request body for tracking a listing view
 */
export interface TrackListingViewBody {
  listingId: number | string;
  sessionId?: string;
}

/**
 * User analytics summary for dashboard display
 */
export interface UserAnalyticsSummary {
  totalViews: number;
  previousMonthViews: number;
  percentageChange: number;
}
