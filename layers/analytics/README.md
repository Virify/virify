# Analytics Layer

## Overview
The Analytics layer provides comprehensive analytics functionality for the Virify application, including tracking user interactions, aggregating metrics, and providing insights into property listing performance and user engagement.

## Features
- 📊 **Analytics Aggregates**: User-specific metrics and counts
- 👀 **Listing View Tracking**: Track and record when users view property listings
- 📈 **User Analytics Summary**: Comprehensive analytics for user's listings performance
- 🎯 **Event Tracking**: Custom event tracking for user interactions
- 📱 **Real-time Metrics**: Live updates of analytics data
- 🔍 **Performance Insights**: Detailed insights into listing performance
- 📋 **Dashboard Integration**: Ready-to-use analytics for user dashboards

## Directory Structure
```
layers/analytics/
├── composables/              # Analytics utilities
│   └── useAnalytics.ts      # Main analytics composable
├── server/                  # Server-side analytics logic
│   └── api/                 # Analytics API endpoints
│       ├── aggregates/      # User metric aggregates
│       ├── all/             # Complete analytics data
│       └── listing/         # Listing-specific analytics
├── tests/                   # Analytics testing
└── nuxt.config.ts          # Layer configuration
```

## API Endpoints

### Analytics Aggregates
- `GET /api/analytics/aggregates/` - Get analytics aggregates (counts) for the authenticated user
  - Returns property counts, view counts, favorite counts, etc.

### Complete Analytics Data
- `GET /api/analytics/all/` - Get comprehensive analytics data for the authenticated user
  - Includes detailed metrics and historical data

### Listing Analytics
- `GET /api/analytics/listing/all/` - Get analytics summary for all user's listings
  - Property-specific performance metrics
- `POST /api/analytics/listing/track-view` - Track a listing view event
  - Records when users view property listings

## Composables

### `useAnalytics()`

The main composable providing analytics functionality:

```typescript
const {
  analytics,                    // User analytics summary
  aggregates,                   // Analytics aggregates (counts)
  aggregatesLoading,           // Loading state for aggregates
  aggregatesError,             // Error state for aggregates
  trackListingView,            // Function to track listing views
  fetchAnalyticsAggregates,    // Function to fetch aggregates
  getAggregateCount           // Function to get specific aggregate count
} = useAnalytics()
```

### Usage Examples

#### Track Listing View
```typescript
// Track when a user views a property listing
await trackListingView(listingId, userId);
```

#### Get User Analytics
```typescript
// Fetch user's analytics aggregates
await fetchAnalyticsAggregates();

// Get specific count
const propertyCount = getAggregateCount('properties');
const viewCount = getAggregateCount('views');
```

#### Dashboard Integration
```vue
<template>
  <div class="analytics-dashboard">
    <div class="metric-card">
      <h3>Total Properties</h3>
      <p>{{ getAggregateCount('properties') }}</p>
    </div>
    
    <div class="metric-card">
      <h3>Total Views</h3>
      <p>{{ getAggregateCount('views') }}</p>
    </div>
    
    <div class="metric-card">
      <h3>Favorites</h3>
      <p>{{ getAggregateCount('favorites') }}</p>
    </div>
  </div>
</template>

<script setup>
const { aggregates, fetchAnalyticsAggregates, getAggregateCount } = useAnalytics();

// Fetch analytics on component mount
await fetchAnalyticsAggregates();
</script>
```

## Data Types

### Analytics Aggregates
```typescript
interface AnalyticsAggregates {
  properties: number;      // Total properties owned
  views: number;          // Total property views
  favorites: number;      // Times properties were favorited
  notes: number;         // Property notes created
  messages: number;      // Messages sent/received
}
```

### Listing Analytics
```typescript
interface ListingAnalytics {
  listingId: number;
  viewCount: number;
  favoriteCount: number;
  noteCount: number;
  lastViewed: Date;
  averageTimeOnListing: number;
}
```

## Migration from Account Counts

This layer replaces the old account counts functionality with proper analytics terminology and enhanced features:

### Migration Guide
| Old | New |
|-----|-----|
| `useAccountCounts` | `useAnalytics` |
| `AccountCounts` type | `AnalyticsAggregates` type |
| `/api/account/counts` | `/api/analytics/aggregates/` |
| `getCount()` | `getAggregateCount()` |
| `fetchAccountCounts()` | `fetchAnalyticsAggregates()` |

### Enhanced Features
- **Expanded Metrics**: More detailed analytics beyond simple counts
- **Performance Tracking**: Track listing performance over time
- **User Engagement**: Measure user interaction with listings
- **Real-time Updates**: Live analytics updates as users interact
- **Historical Data**: Track trends and changes over time

## Best Practices

### Performance
- **Batch Tracking**: Group multiple analytics events for efficient processing
- **Async Operations**: Use async/await for all analytics API calls
- **Error Handling**: Always handle analytics errors gracefully
- **Caching**: Cache analytics data to reduce API calls

### Privacy
- **User Consent**: Ensure proper user consent for analytics tracking
- **Data Minimization**: Only track necessary data points
- **Anonymization**: Consider anonymizing sensitive data
- **GDPR Compliance**: Follow data protection regulations

### Implementation
- **Non-blocking**: Analytics should not block user interactions
- **Fallbacks**: Provide fallback values when analytics fail
- **Testing**: Test analytics in different scenarios
- **Documentation**: Document all tracked events and metrics

## Configuration

Add analytics configuration to your environment:
```env
# Analytics settings
ANALYTICS_ENABLED=true
ANALYTICS_BATCH_SIZE=50
ANALYTICS_FLUSH_INTERVAL=30000
```

Configure in your Nuxt config:
```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    analytics: {
      enabled: process.env.ANALYTICS_ENABLED === 'true',
      batchSize: parseInt(process.env.ANALYTICS_BATCH_SIZE || '50'),
      flushInterval: parseInt(process.env.ANALYTICS_FLUSH_INTERVAL || '30000')
    }
  }
})
```
