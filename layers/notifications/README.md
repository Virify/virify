# Notifications Layer

## Overview

The notifications layer manages all in-app notification state for Virify. It exposes the `useNotifications` singleton composable that holds badge counts, a paginated notification list, and toast display state. It receives real-time updates via the WebSocket layer and falls back to HTTP polling.

## Directory Structure

```
layers/notifications/
├── composables/
│   └── useNotifications.ts        # Singleton composable (createSharedComposable)
├── types/
│   └── notification.ts            # InAppNotificationPayload type
├── utils/
│   ├── notification.ts            # calculateOptimisticCount()
│   ├── notification-filters.ts    # Pure filter/count helpers
│   └── aggregate-updates.ts       # isStaleWsEvent(), race condition guard
└── tests/
    └── notification-filters.test.ts
```

## Notification Types

Defined in `shared/types/notifications.ts`:

```ts
type NotificationType =
  | "NEW_MESSAGE"
  | "NEW_ENQUIRY"
  | "ENQUIRY_REPLY"
  | "LISTING_UPDATE"
  | "SYSTEM"
  | "VIEWING_REQUEST"
  | "VIEWING_ACCEPTED"
  | "VIEWING_REJECTED"
  | "VIEWING_RESCHEDULED"
  | "VIEWING_CANCELLED"
```

## `useNotifications()` Composable

Created with `createSharedComposable` — one instance shared across all components.

### State

| Ref | Type | Description |
|-----|------|-------------|
| `aggregates` | `UserItemsAggregates` | Badge counts for all 17 nav/dashboard fields |
| `notifications` | `UserNotification[]` | Paginated notification list |
| `notificationCounts` | `NotificationCounts` | Counts grouped by type |
| `lastNotification` | `InAppNotificationPayload \| null` | Current toast payload |
| `notificationHasMore` | `boolean` | Whether more pages exist |

**`UserItemsAggregates`** — 17 fields used to drive the navigation badge system:

```ts
{
  favourites, notes, hiddenListings, viewedListings,
  enquiries, locations, listings, draftListings, archivedListings,
  messages, unreadMessages, unreadConversations,
  sentEnquiries, sentUnreadEnquiries,
  receivedEnquiries, receivedUnreadEnquiries,
  viewings   // PENDING + ACCEPTED + RESCHEDULED
}
```

### Methods

| Method | HTTP | Description |
|--------|------|-------------|
| `fetchUserItemsAggregates(force?)` | `GET /api/notifications/aggregates` | Refresh all badge counts. Records fetch timestamp (guard against stale WS events). Cached 5 min server-side. |
| `fetchNotifications(options?)` | `GET /api/notifications` | Paginated list. Options: `includeRead`, `limit`, `page`, `append`, `force` |
| `fetchNotificationCounts()` | `GET /api/notifications/counts` | Per-type counts. Cached 2 min server-side. |
| `loadMoreNotifications()` | — | Append next page if `notificationHasMore` |
| `handleAggregateUpdate(payload)` | — | Optimistic local mutation from WS event |
| `showToast(payload?)` | — | Display in-app toast (with dedup guard) |
| `addNotification(notification)` | — | Prepend to notification list |

### Race Condition Protection

Optimistic updates from WebSocket events can arrive after a stale HTTP response:

1. Every HTTP fetch records `lastFetchTime`
2. `isStaleWsEvent(wsTimestamp, lastFetchTime)` in `aggregate-updates.ts` rejects WS messages older than the last fetch
3. This prevents badge flicker caused by DB replication lag

### Multi-tab Deduplication

`toastedNotificationIds` (a `Set`) prevents the same notification toast from appearing in multiple tabs simultaneously.

## Utility Functions

### `notification-filters.ts`

```ts
countUnreadNotifications(notifications, filterType?, conversationId?) → number
getUnreadNotifications(notifications) → UserNotification[]
getNonDismissedNotifications(notifications) → UserNotification[]
findNotification(notifications, notificationId) → UserNotification | undefined
```

### `aggregate-updates.ts`

```ts
isStaleWsEvent(wsTimestamp: string, lastFetch: string) → boolean
calculateOptimisticCount(currentCount: number, operation: "add" | "remove") → number
```

## Integration with Other Layers

| Layer | Integration |
|-------|------------|
| **WebSocket** | `onAggregateUpdate` → `handleAggregateUpdate()`, `onNotificationNew` → `addNotification()` + `showToast()` |
| **Dashboard** | `OrganismsDashboardNotificationButton` reads `notifications` and `aggregates.unreadMessages` |
| **Database** | Notification API endpoints live in `layers/database/server/api/notifications/` |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/notifications` | Paginated notification list (default limit: 20) |
| `GET` | `/api/notifications/counts` | Counts by type (cached 2 min) |
| `GET` | `/api/notifications/aggregates` | Badge counts for all 17 fields (cached 5 min) |
| `POST` | `/api/notifications/mark-read` | Mark as read — all, by conversation, or single |
| `POST` | `/api/notifications/dismiss` | Dismiss notification(s) |

---

## ✨ Current Features
- **Count Badges**: Visual notification counts for favourites, notes, and enquiries in the navigation
- **Real-time Updates**: WebSocket-based updates for notification counts

---

## 🛣️ Roadmap / Future Features
- **Push Notifications**: Browser/mobile push support
- **Email Notifications**: Email alerts for important events
- **In-app Notifications**: Notification bell/dropdown with history
- **Notification Preferences**: User settings for notification delivery
- **Real-time Alerts**: Toast/banner notifications for immediate feedback

---

## 🏗️ Architecture & Integration
- **Separation from Analytics**: Pure notification logic, not mixed with analytics
- **WebSocket Integration**: Relies on the [WebSocket Layer](../websocket/README.md) for real-time updates
- **Multi-channel Ready**: Designed to support visual, push, email, and other notification types

---

## ⚙️ Setup & Usage

### Docker
- No special setup required; notifications work out-of-the-box with Docker (`make up`)

### Local
- Ensure the WebSocket server is running (see [WebSocket Layer](../websocket/README.md))
- Notification counts update in real-time as you interact with the app

---

## 🧩 Extending Notifications
- Add new notification types by extending the notification service in this layer
- For push/email, integrate with browser APIs or the [Email Layer](../email/README.md)
- Update UI components in the main app as needed

---

## 🏆 Best Practices
- Keep notification logic separate from analytics/business logic
- Use real-time updates for instant feedback
- Allow users to configure notification preferences (future)
- Test notification flows thoroughly

---

## 🔗 Related Docs
- [WebSocket Layer](../websocket/README.md)
- [Email Layer](../email/README.md)
