# WebSocket Layer

## Overview

The WebSocket layer provides the real-time messaging backbone for Virify. It uses Nitro's experimental WebSocket support to maintain persistent connections, and exposes a single `useWebSocketServer` composable that handles both server-side routing and client-side event dispatching.

The client plugin (`plugins/websocket.client.ts`) establishes one connection per browser session and distributes incoming events to the relevant composables (`useEnquiries`, `useNotifications`, `useViewings`, etc.).

## Directory Structure

```
layers/websocket/
├── composables/
│   └── useWebSocketServer.ts    # Unified server + client composable
├── plugins/
│   └── websocket.client.ts      # Global Nuxt plugin — single connection point
├── server/
│   └── api/
│       └── _ws/
│           └── connection.ts    # Nitro WebSocket endpoint
└── nuxt.config.ts               # Enables nitro.experimental.websocket + WS_BASE_URL
```

## Message Types

Defined in `shared/types/websocket.ts`:

| Type | Direction | Purpose |
|------|-----------|---------|
| `new_message` | Server → Client | Deliver a new chat message |
| `new_conversation` | Server → Client | Notify recipient of a new conversation |
| `typing` | Bidirectional | Typing indicator (high-frequency, debounced) |
| `message_read` | Bidirectional | Read receipt for a message |
| `connection_status` | Server → Client | User online/offline status change |
| `aggregate_update` | Server → Client | A badge count changed (e.g. unread messages +1) |
| `notification_new` | Server → Client | A new `UserNotification` record was created |
| `conversation_presence` | Client → Server | User opened or closed a conversation view |

## `useWebSocketServer` Composable

The composable is used on **both** server endpoints and the client plugin.

### Server-side (used inside Nitro event handlers)

```ts
const ws = useWebSocketServer()

// Register / unregister a peer (called by connection.ts automatically)
ws.addPeer(userId, peer)
ws.removePeer(userId, peer)

// Send to specific user(s) or broadcast
ws.sendToPeers([userId1, userId2], message)
ws.sendToAll(message)
ws.sendMessage(message)  // auto-routes based on message.to

// Presence queries
ws.isUserOnline(userId)
ws.isUserViewingConversation(userId, conversationId)
```

### Type-safe message constructors

```ts
createNewMessageMessage(conversationId, message, to, from?, conversation?)
createNewConversationMessage(conversation, to, from?)
createTypingMessage(conversationId, to, isTyping)
createMessageReadMessage(conversationId, messageId, to)
createConnectionStatusMessage(userId, isOnline, to)
createAggregateUpdateMessage(aggregateType, operation, to)
createNotificationNewMessage(notification, to)
```

### Client-side (used in `websocket.client.ts`)

```ts
const ws = useWebSocketServer()

ws.handleOutgoingMessages(rawData, {
  onNewMessage:        ({ conversationId, message }) => { ... },
  onNewConversation:   ({ conversation }) => { ... },
  onTyping:            ({ from, conversationId, isTyping }) => { ... },
  onMessageRead:       ({ conversationId, messageId }) => { ... },
  onAggregateUpdate:   ({ aggregateType, operation }) => { ... },
  onNotificationNew:   ({ notification }) => { ... },
})
```

## Connection Handler (`server/api/_ws/connection.ts`)

The Nitro WebSocket endpoint implements the full peer lifecycle:

| Hook | Behaviour |
|------|-----------|
| `upgrade(req)` | Validates user session via `requireUserSession()` — rejects unauthenticated connections |
| `open(peer)` | Registers peer against `userId`, emits presence update |
| `close(peer)` | Unregisters peer, cleans up presence state |
| `message(peer, msg)` | Routes: pings return pong; `typing` and `message_read` frames are validated against participant cache (60s TTL) before routing; `new_message` frames are rejected (HTTP-only) |

**Security notes:**
- `new_message` frames from clients are silently dropped — messages are only sent via the HTTP API
- For `typing` and `message_read`, the server overwrites the client-supplied `to` field with the real participant list from DB (validated via participant cache)
- Participant cache has a 60s TTL with a 10s cleanup interval to avoid per-frame DB hits on high-frequency typing events

## Client Plugin (`plugins/websocket.client.ts`)

Runs once per browser session. Responsibilities:
- Opens the WebSocket connection to `$config.public.WS_BASE_URL + "/api/_ws/connection"`
- Supplies `handleOutgoingMessages()` callback handlers for all 6 message types
- Routes events to: `useNotifications()`, `useEnquiries()`, `useGlobalEnquiryModal()`, `useViewings()`
- Applies **optimistic local state updates** to avoid UI flicker caused by DB replication lag after a WebSocket event
- Auto-reconnects up to 3 times at 1-second intervals on unexpected disconnection

## Global Singleton State

`useWebSocketServer` maintains two module-level `Map`s accessible from all server events:

| Map | Key | Value | Purpose |
|-----|-----|-------|---------|
| `globalPeers` | `userId` | `Set<Peer>` | Supports multiple tabs per user |
| `globalActiveConversationByUser` | `userId` | `conversationId \| null` | Used to suppress notification toasts when recipient is already viewing that conversation |

## Environment Variables

```bash
WS_BASE_URL=wss://virify.co.uk   # Public WebSocket base URL
```
