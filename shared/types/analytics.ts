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
