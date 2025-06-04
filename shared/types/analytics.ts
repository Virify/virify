/**
 * Types related to analytics functionality
 */

/**
 * Analytics aggregates interface (formerly AccountCounts)
 * Contains counts for various user metrics and activities
 */
export interface AnalyticsAggregates {
  notifications?: number;
  messages?: number;
  enquiries?: number;
  listings?: number;
  favourites?: number;
  notes?: number;
  offers?: number;
  viewings?: number;
}

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
  favoritedByOthersCount: number;
  totalConversations: number;
}

/**
 * Analytics aggregates for various user metrics
 * Renamed from AccountCounts to better reflect analytics nature
 */
export interface AnalyticsAggregates {
  notifications?: number;
  messages?: number;
  enquiries?: number;
  listings?: number;
  favourites?: number;
  notes?: number;
  offers?: number;
  viewings?: number;
  // Add more aggregate types as needed
}
