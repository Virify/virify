/**
 * Types related to analytics functionality
 * Pure analytics data for business intelligence and performance metrics
 */

import type { ListingCardType } from "#imports";

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
  // Seller Analytics (Your Listings Performance)
  totalViews: number;
  previousMonthViews: number;
  percentageChange: number;
  favoritedByOthersCount: number;
  totalConversations: number; // Enquiries received on your listings
  totalListings: number;
  activeListings: number;
  listingsWithNotes: number;
  averageViewsPerListing: number;
  
  // Buyer/Searcher Analytics (Your Activity)
  sentEnquiries: number; // Enquiries you sent
  sentEnquiriesWithReplies: number; // Enquiries you sent that got replies
  totalFavourites: number; // Listings you favorited
  totalNotes: number; // Listings you added notes to
  recentlyViewedCount: number; // Listings you viewed recently
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

export type RecentItem = {
  id: number;
  note?: string;
  listing?: {
    id: number;
    price?: number;
    listingTier?: string;
    rentalListing?: {
      rentFrequency?: string;
    };
    saleListing?: {
      priceType?: string;
    };
    property?: {
      numberBedrooms?: number;
      numberBathrooms?: number;
      address?: {
        street?: string;
        city?: string;
        postcode?: string;
        fullAddress?: string;
      };
      media?: Array<{
        image?: string;
      }>;
    };
  };
  isFavourite?: boolean;
}

/**
 * Quick analytics for dashboard homepage (lightweight)
 */
export interface QuickAnalytics {
  activeListings: number;
  totalEnquiriesReceived: number;
  totalEnquiriesSent: number;
  favouritesReceived: number;
  last7Days: {
    views: number;
    impressions: number;
    clicks: number;
    ctr: number;
  };
}

/**
 * Time series data point for analytics graphs
 */
export interface AnalyticsTimeSeriesPoint {
  date: string;
  views: number;
  impressions: number;
  clicks: number;
  favourites: number;
  enquiries: number;
}

/**
 * Per-listing analytics breakdown
 */
export interface ListingAnalytics {
  id: number;
  address: string;
  image: string | null;
  price: number;
  bedrooms: number;
  tier: string;
  views: number;
  impressions: number;
  clicks: number;
  favourites: number;
  enquiries: number;
  avgDuration: number;
  ctr: number;
}

/**
 * Traffic source breakdown
 */
export interface TrafficSource {
  source: string;
  count: number;
  percentage: number;
}

/**
 * Device breakdown
 */
export interface DeviceBreakdown {
  device: string;
  count: number;
  percentage: number;
}

/**
 * Comprehensive analytics summary
 */
export interface ComprehensiveAnalyticsSummary {
  totalViews: number;
  totalImpressions: number;
  totalFavourites: number;
  totalEnquiries: number;
  ctr: number;
  viewsChange: number;
  impressionsChange: number;
  activeListings: number;
  totalListings: number;
}

/**
 * Full comprehensive analytics response
 */
export interface ComprehensiveAnalytics {
  summary: ComprehensiveAnalyticsSummary;
  timeSeries: AnalyticsTimeSeriesPoint[];
  topListings: ListingAnalytics[];
  trafficSources: TrafficSource[];
  deviceBreakdown: DeviceBreakdown[];
  period: '7d' | '30d' | '90d';
}
