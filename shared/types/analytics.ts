/**
 * Types related to analytics functionality
 * Pure analytics data for business intelligence and performance metrics
 */

/**
 * Request body for tracking a listing view
 */
export interface TrackListingViewBody {
  listingId: number | string;
  sessionId?: string;
}

/**
 * User analytics summary for dashboard display
 * Pure analytics data about user activity and performance
 */
export interface UserAnalyticsSummary {
  totalViews: number;
  previousMonthViews: number;
  percentageChange: number;
  favoritedByOthersCount: number;
  totalConversations: number;
}

/**
 * Pure analytics aggregates for business intelligence
 * This is for actual analytics/reporting, not user notification counts
 */
export interface AnalyticsAggregates {
  // Performance metrics
  totalPageViews?: number;
  uniqueVisitors?: number;
  averageSessionDuration?: number;
  
  // Business metrics  
  totalListings?: number;
  activeListings?: number;
  totalUsers?: number;
  activeUsers?: number;
  
  // Engagement metrics
  totalSearches?: number;
  totalEnquiries?: number;
  conversionRate?: number;
  
  // Growth metrics
  newUsersThisMonth?: number;
  newListingsThisMonth?: number;
  
  // Add more analytics metrics as needed
}

export type RecentlyViewed = {
  id: number;
  listingId: number | null;
  listing: ListingCardType | null;
  userId?: number | null;
  createdAt: Date | string;
  sessionId?: string | null;
  ip?: string | null;
};
