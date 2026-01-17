/**
 * Types related to analytics functionality
 * Pure analytics data for business intelligence and performance metrics
 */

import type { ListingCardType } from "#imports";

// ============================================================================
// TRACKING EVENT TYPES (used by useAnalyticsTracking composable)
// ============================================================================

/**
 * Event types for analytics tracking
 */
export type AnalyticsEventType = 
  | 'view'           // User views a listing detail page
  | 'impression'     // Listing appears in search results
  | 'click'          // User clicks listing card in search results  
  | 'favourite'      // User favourites/unfavourites a listing
  | 'enquiry'        // User sends an enquiry
  | 'share'          // User shares a listing
  | 'search'         // User performs a search
  | 'mortgage_calc'; // User uses mortgage calculator

/**
 * Base payload for all tracking events
 * sessionId is null when user declines consent (anonymous tracking)
 */
export interface TrackingBasePayload {
  sessionId: string | null;
  timestamp: number;
  userAgent?: string;
  referrer?: string;
}

/**
 * Traffic source types
 */
export type TrafficSourceType = 'search' | 'direct' | 'social' | 'email' | 'referral';

/**
 * Listing event payload (view, click, enquiry, share)
 */
export interface TrackingListingPayload extends TrackingBasePayload {
  listingId: number | string;
  source?: TrafficSourceType;
  position?: number; // Position in search results (for impressions/clicks)
}

/**
 * Impression batch payload - for tracking multiple impressions at once
 */
export interface TrackingImpressionBatchPayload extends TrackingBasePayload {
  listingIds: number[];
  source?: string;
  searchQuery?: string;
}

/**
 * Favourite event payload
 */
export interface TrackingFavouritePayload extends TrackingBasePayload {
  listingId: number | string;
  action: 'add' | 'remove';
}

/**
 * Share event payload
 */
export interface TrackingSharePayload extends TrackingBasePayload {
  listingId: number | string;
  platform: string;
}

/**
 * Search event payload
 */
export interface TrackingSearchPayload extends TrackingBasePayload {
  listingType: string;
  query: string;
  location: {
    id: string;
    placeName: string;
    text: string;
    lat: number;
    lon: number;
  };
  radius: number;
  resultCount: number;
  filters?: Record<string, unknown>;
}

/**
 * Mortgage calculation event payload
 */
export interface TrackingMortgageCalcPayload extends TrackingBasePayload {
  listingId?: string | null;
  propertyPrice: number;
  deposit: number;
  termYears: number;
  buyerType: string;
  customRate?: number | null;
  loanAmount: number;
  ltv: number;
  ltvBracket: string;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  rateUsed: number;
  rateType: string;
  usedDefaultRates: boolean;
  usedCustomRate: boolean;
}

// ============================================================================
// LEGACY/EXISTING TYPES
// ============================================================================

/**
 * Request body for tracking a listing view
 * @deprecated Use TrackingListingPayload instead
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
