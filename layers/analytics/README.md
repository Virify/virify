# Analytics Layer

## Overview

The analytics layer tracks user interactions and provides business intelligence for the admin dashboard and user analytics pages. It uses `navigator.sendBeacon` for fire-and-forget event tracking (non-blocking, survives page unloads) and fetches aggregated analytics data for display.

Two composables handle separate concerns:
- `useAnalyticsTracking()` — outbound event tracking (POST, fire-and-forget)
- `useAnalytics()` — inbound data fetching (GET, for dashboard and analytics display)

## Directory Structure

```
layers/analytics/
├── composables/
│   ├── useAnalytics.ts            # Data fetching: quick, comprehensive, trending locations
│   └── useAnalyticsTracking.ts    # Event tracking via sendBeacon
├── server/
│   └── api/
│       └── analytics/
│           ├── track/             # POST /api/analytics/track — ingest tracking events
│           ├── quick/             # GET  /api/analytics/quick — lightweight dashboard summary
│           ├── comprehensive/     # GET  /api/analytics/comprehensive — full time-series data
│           ├── all/               # GET  /api/analytics/all — all analytics rollup
│           ├── aggregates/        # GET  /api/analytics/aggregates — user item aggregates
│           ├── listing/           # GET  /api/analytics/listing/:id — per-listing analytics
│           ├── search/            # GET  /api/analytics/search — search analytics
│           │   └── location/      # GET  /api/analytics/search/location — trending locations
│           └── mortgage/          # GET  /api/analytics/mortgage — mortgage calc usage
├── tests/
└── utils/
```

## `useAnalyticsTracking()` — Event Tracking

```ts
const {
  trackListingView,
  trackListingImpression,
  trackSearch,
  trackMortgageCalculation,
  trackContactEnquiry,
} = useAnalyticsTracking()
```

All tracking methods use `navigator.sendBeacon('/api/analytics/track', payload)` — non-blocking and fire-and-forget. A stable `sessionId` (nanoid, stored in `useState`) deduplicates repeated views within a session. Cookie consent is checked before including `sessionId` — declined users are tracked anonymously (`sessionId: null`).

## `useAnalytics()` — Data Fetching

```ts
const {
  // Quick analytics (dashboard homepage, lightweight)
  quickAnalytics,
  isQuickLoading,
  fetchQuickAnalytics,

  // Comprehensive analytics (analytics page, full time-series)
  comprehensiveAnalytics,
  isComprehensiveLoading,
  fetchComprehensiveAnalytics,
  selectedPeriod,    // '7d' | '30d' | '90d'

  // User content
  recentlyViewedListings,
  recentOwnedListings,
  allUserListings,

  // Trending
  trendingLocations,

  // Orchestration
  refreshAll,
} = useAnalytics()
```

`useAnalytics` is a `createSharedComposable` singleton. It also orchestrates refreshing recent favourites and notes from `useDashboardRecentItems()` after user interactions that might change those lists.

## Analytics Modes

| Mode | Endpoint | Use case |
|------|----------|---------|
| Quick | `/api/analytics/quick` | Dashboard homepage summary cards — fast, low DB cost |
| Comprehensive | `/api/analytics/comprehensive?period=30d` | Full analytics page with time-series charts |
| Aggregates | `/api/analytics/aggregates` | User item counts (favourites, notes, views, etc.) |

## Privacy & Consent

- Cookie consent is checked via `useCookieConsent()` before including `sessionId`
- Users who decline tracking are tracked anonymously (`sessionId: null`)
- No PII is included in tracking payloads

## Integration

`nuxt-gtag` is also configured in the root `nuxt.config.ts` for Google Analytics alongside the custom internal analytics.
