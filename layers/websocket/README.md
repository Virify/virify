# WebSocket Layer

## Overview
The WebSocket layer provides real-time messaging and communication functionality for the Virify platform. It enables instant messaging between users, typing indicators, and real-time notifications using a unified composable architecture.

## Features
- 💬 Real-time messaging between users
- ⌨️ Typing indicators with debouncing
- 🔔 Live notifications and events
- 🔗 Persistent WebSocket connections
- 🛡️ Secure peer management with user sessions
- 📨 Type-safe message routing and validation
- 🎯 Event-driven UI updates

## Architecture

### Unified Composable System
The layer uses a single composable (`useWebSocketServer`) that handles:
- **Server-side**: Incoming message validation and routing to connected peers
- **Client-side**: Outgoing message handling and UI event dispatching

### Message Flow
```
CLIENT A → SERVER (handleIncomingMessages) → CLIENT B (handleOutgoingMessages) → UI Events
```

## Directory Structure
```
layers/websocket/
├── composables/
│   └── useWebSocketServer.ts    # Unified WebSocket composable
├── server/
│   └── api/
│       └── _ws/
│           └── connection.ts    # WebSocket connection handler
└── nuxt.config.ts              # Layer configuration
```

## Message Types

### New Message
```typescript
{
  type: "new_message",
  conversationId: number,
  message: MessageWithUser,
  recipients: number[],
  from: number
}
```

### Typing Indicator
```typescript
{
  type: "typing",
  conversationId: number,
  to: number,
  isTyping: boolean,
  from: number
}
```

### New Conversation
```typescript
{
  type: "new_conversation",
  conversation: ConversationWithUserAndMessages,
  recipients: number[],
  from: number
}
```

## Usage

### Client-Side Implementation
```vue
<script setup>
import { useWebSocket } from "@vueuse/core";
import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";

// WebSocket connection
const config = useRuntimeConfig();
const { status, data, send } = useWebSocket(config.public.WS_BASE_URL + "/api/_ws/connection");

// WebSocket utilities
const { createTypingMessage, handleOutgoingMessages } = useWebSocketServer();

// Event handlers for UI updates
const webSocketEvents = {
  onNewMessage: ({ conversationId, message }) => {
    // Update UI with new message
  },
  onTyping: ({ from, conversationId, isTyping }) => {
    // Show/hide typing indicator
  },
  onNewConversation: ({ conversation }) => {
    // Add new conversation to UI
  }
};

// Route incoming WebSocket messages to event handlers
watchEffect(() => {
  if (data.value) {
    handleOutgoingMessages(data.value, webSocketEvents);
  }
});

// Send typing indicator
function sendTyping(conversationId, recipientId, isTyping) {
  const message = createTypingMessage(conversationId, recipientId, isTyping);
  send(JSON.stringify(message));
}
</script>
```

### Server-Side Message Broadcasting
```typescript
// In API routes
import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";

const { sendMessage, createNewMessageMessage } = useWebSocketServer();

// Broadcast message to all conversation participants
const messageToSend = createNewMessageMessage(
  conversationId,
  newMessage,
  [senderId, receiverId], // Send to both sender and receiver
  senderId
);

sendMessage(messageToSend);
```

## Event Handlers

### handleIncomingMessages (Server)
Processes messages received from clients:
- Validates message format and user permissions
- Routes messages to appropriate recipients
- Manages peer connections

### handleOutgoingMessages (Client)
Processes messages received from server:
- Parses incoming WebSocket data
- Routes to appropriate UI event handlers
- Updates client-side state

## Best Practices

### Message Validation
- Always validate message types and required fields
- Check user permissions before processing messages
- Handle malformed messages gracefully

### UI Updates
- Use event handlers for clean separation of concerns
- Prevent duplicate message processing
- Auto-scroll to new messages when appropriate

### Connection Management
- Handle connection loss and reconnection
- Clean up peer connections on user disconnect
- Gracefully handle session expiration

### Performance
- Debounce typing indicators to reduce spam
- Use efficient message routing to specific recipients
- Implement heartbeat for connection health

## Configuration

Add WebSocket URL to your runtime config:
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      WS_BASE_URL: process.env.WS_BASE_URL || 'ws://localhost:3000'
    }
  }
})
```

## Testing

The layer includes comprehensive tests for:
- Message creation and validation
- Peer management
- Event handler routing
- Connection lifecycle

Run tests with:
```bash
pnpm test
```

## Security Considerations

- All WebSocket connections require valid user sessions
- Messages are validated before routing
- Peer isolation prevents cross-user message leakage
- Session expiration automatically disconnects users
