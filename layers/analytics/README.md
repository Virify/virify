# Analytics Layer

This layer provides comprehensive analytics functionality for the Virify application, including tracking user interactions, aggregating metrics, and providing insights.

## Features

- **Analytics Aggregates**: Replaces the old "account counts" with proper analytics terminology
- **Listing View Tracking**: Track and record when users view listings
- **User Analytics Summary**: Comprehensive analytics for user's listings performance

## API Endpoints

### Analytics Aggregates
- `GET /api/analytics/aggregates/` - Get analytics aggregates (counts) for the authenticated user

### Analytics Data
- `GET /api/analytics/all/` - Get all analytics data for the authenticated user

### Listing Analytics
- `GET /api/analytics/listing/all/` - Get analytics summary for all user's listings
- `POST /api/analytics/listing/track-view` - Track a listing view event

## Composables

### `useAnalytics()`

The main composable providing analytics functionality:

```typescript
const {
  analytics,              // User analytics summary
  aggregates,            // Analytics aggregates (counts)
  aggregatesLoading,     // Loading state for aggregates
  aggregatesError,       // Error state for aggregates
  trackListingView,      // Function to track listing views
  fetchAnalyticsAggregates, // Function to fetch aggregates
  getAggregateCount      // Function to get specific aggregate count
} = useAnalytics()
```

## Migration from Account Counts

This layer replaces the old account counts functionality:
- `useAccountCounts` → `useAnalytics`
- `AccountCounts` type → `AnalyticsAggregates` type
- `/api/account/counts` → `/api/analytics/aggregates/`
- `getCount()` → `getAggregateCount()`
- `fetchAccountCounts()` → `fetchAnalyticsAggregates()`
