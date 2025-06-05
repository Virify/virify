import type { TypingMessage, NewMessageMessage, MessageReadMessage, HeartbeatMessage, WebSocketMessage, NewConversationMessage, ConnectionStatusMessage } from "../../../shared/types/websocket";

/**
 * Client-side event handlers interface
 */
export interface WebSocketEvents {
  onNewMessage: (data: { conversationId: number; message: any }) => void;
  onNewConversation: (data: { conversation: any }) => void;
  onTyping: (data: { from: number; conversationId: number; isTyping: boolean }) => void;
  onMessageRead: (data: { conversationId: number; messageId: number; from: number }) => void;
}

/**
 * Global singleton peers Map - shared across all composable instances
 */
const globalPeers = new Map<number, Set<{ send: (data: string) => void; close: () => void }>>();

/**
 * Unified WebSocket composable for handling all message types
 * Provides both server-side message routing and client-side event handling
 */
export const useWebSocketServer = () => {
  // Use the global singleton peers Map
  const peers = globalPeers;

  /**
   * Adds a new WebSocket peer for a user
   * @param userId - The ID of the user
   * @param peer - The WebSocket peer connection object
   */
  const addPeer = (userId: number, peer: { send: (data: string) => void; close: () => void }) => {
    if (!peers.has(userId)) {
      peers.set(userId, new Set());
    }
    peers.get(userId)!.add(peer);
  };

  /**
   * Removes a WebSocket peer for a user
   * @param userId - The ID of the user
   * @param peer - The WebSocket peer connection object to remove
   */
  const removePeer = (userId: number, peer: { send: (data: string) => void; close: () => void }) => {
    const userPeers = peers.get(userId);
    if (userPeers) {
      userPeers.delete(peer);
      if (userPeers.size === 0) {
        peers.delete(userId);
      }
    }
  };

  /**
   * Sends a message to specific WebSocket peers
   * @param userIds - The ID(s) of the user(s) to send the message to
   * @param message - The message object to send
   */
  const sendToPeers = (userIds: number | number[], message: any) => {
    const recipients = Array.isArray(userIds) ? userIds : [userIds];

    recipients.forEach((userId) => {
      const userPeers = peers.get(userId);
      if (userPeers) {
        userPeers.forEach((peer) => {
          try {
            peer.send(JSON.stringify(message));
          } catch (error) {
            console.error(`Failed to send to user ${userId}:`, error);
          }
        });
      }
    });
  };

  /**
   * Sends a message to all connected peers
   * @param message - The message object to send to all connected peers
   */
  const sendToAll = (message: any) => {
    peers.forEach((userPeers, userId) => {
      userPeers.forEach((peer) => {
        try {
          peer.send(JSON.stringify(message));
        } catch (error) {
          console.error(`Failed to send to user ${userId}:`, error);
        }
      });
    });
  };

  /**
   * Routes messages to appropriate WebSocket peers based on message content
   * This is the main message distribution function that determines where messages go
   *
   * @param message - The message object to send (must include 'to' field for routing)
   *
   * Routing Logic:
   * - `to: "all"` → Broadcasts to every connected user (rare, used for system announcements)
   * - `to: [1,2,3]` → Sends to specific user IDs (typical for group chats)
   * - `to: 123` → Sends to single user ID (typical for direct messages)
   */
  const sendMessage = (message: any) => {
    if (!message.timestamp) {
      message.timestamp = new Date().toISOString();
    }

    if (message.to === "all") {
      sendToAll(message);
    } else if (message.to) {
      sendToPeers(message.to, message);
    }
  };

  /**
   * Handles incoming WebSocket messages from clients and routes them to appropriate peers
   * Validates message structure and creates type-safe message objects
   * @param rawMessage - The raw JSON string message received from client
   * @param fromUserId - The ID of the user who sent the message
   */
  const handleIncomingMessages = (rawMessage: string, fromUserId: number) => {
    try {
      const message = JSON.parse(rawMessage);
      message.from = fromUserId;

      switch (message.type) {
        /**
         * Typing indicator message - Shows when a user is typing in a conversation
         * Real-time indicator that appears/disappears as users type messages
         * Used for: Live chat UX, showing "User is typing..." indicators
         */
        case "typing": {
          const typingMsg: TypingMessage = {
            type: "typing",
            conversationId: message.conversationId,
            from: fromUserId,
            to: message.to,
            isTyping: message.isTyping,
            timestamp: new Date().toISOString(),
          };
          sendMessage(typingMsg);
          break;
        }

        /**
         * Message read notification - Confirms when a message has been read by recipient
         * Provides read receipts functionality similar to WhatsApp/iMessage
         * Used for: Read status indicators, delivery confirmations
         */
        case "message_read": {
          const readMsg: MessageReadMessage = {
            type: "message_read",
            conversationId: message.conversationId,
            messageId: message.messageId,
            from: fromUserId,
            to: message.to,
            timestamp: new Date().toISOString(),
          };
          sendMessage(readMsg);
          break;
        }

        /**
         * New message broadcast - Delivers actual chat messages between users
         * Core messaging functionality for real-time chat delivery
         * Used for: Instant message delivery, chat notifications
         */
        case "new_message": {
          const newMsg: NewMessageMessage = {
            type: "new_message",
            conversationId: message.conversationId,
            message: message.message,
            from: fromUserId,
            to: message.to,
            timestamp: new Date().toISOString(),
          };
          sendMessage(newMsg);
          break;
        }

        /**
         * Heartbeat/ping message - Keeps WebSocket connection alive
         * Prevents connection timeouts and confirms client is still active
         * Used for: Connection keep-alive, detecting disconnected clients
         */
        case "heartbeat": {
          const heartbeatMsg: HeartbeatMessage = {
            type: "heartbeat",
            from: fromUserId,
            timestamp: new Date().toISOString(),
          };
          sendMessage(heartbeatMsg);
          break;
        }

        default:
          console.warn("Unknown message type:", message.type);
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  };

  /**
   * Checks if a user is currently online and has active WebSocket connections
   * @param userId - The ID of the user to check
   * @returns True if the user has active connections, false otherwise
   */
  const isUserOnline = (userId: number) => {
    return peers.has(userId) && peers.get(userId)!.size > 0;
  };

  /**
   * Handles outgoing WebSocket events and routes them to appropriate UI handlers
   * Proccesses messages FROM the server to the client
   * @param rawData - The raw WebSocket message data
   * @param events - Object containing event handler callbacks for different message types
   */
  const handleOutgoingMessages = (rawData: string, events: WebSocketEvents) => {
    if (!rawData || rawData === "ping") return;

    try {
      const wsMessage: WebSocketMessage = JSON.parse(rawData);

      switch (wsMessage.type) {
        /**
         * New message received - Updates UI when a new chat message arrives
         * Triggers: Message list updates, notifications, sound alerts
         * UI Effect: Adds message to conversation, scrolls to bottom, shows notification
         */
        case "new_message":
          events.onNewMessage({
            conversationId: wsMessage.conversationId!,
            message: wsMessage.message!,
          });
          break;

        /**
         * New conversation created - Updates UI when a new chat conversation starts
         * Triggers: Conversation list refresh, navigation to new chat
         * UI Effect: Adds conversation to sidebar, opens chat window
         */
        case "new_conversation":
          events.onNewConversation({
            conversation: wsMessage.conversation!,
          });
          break;

        /**
         * Typing indicator received - Shows/hides "user is typing" UI elements
         * Triggers: Typing indicator animations, status text updates
         * UI Effect: Shows "John is typing..." text or animated dots
         */
        case "typing":
          events.onTyping({
            from: wsMessage.from!,
            conversationId: wsMessage.conversationId!,
            isTyping: wsMessage.isTyping!,
          });
          break;

        /**
         * Message read confirmation - Updates message status when read by recipient
         * Triggers: Read receipt indicators, message status icons
         * UI Effect: Shows checkmarks, "Read" status, read timestamps
         */
        case "message_read":
          events.onMessageRead({
            from: wsMessage.from!,
            conversationId: wsMessage.conversationId!,
            messageId: wsMessage.messageId!,
          });
          break;

        default:
          console.warn("Unknown message type:", wsMessage.type);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };

  /**
   * Creates a type-safe typing message for WebSocket transmission
   * @param conversationId - The ID of the conversation
   * @param to - The user ID to send the typing indicator to
   * @param isTyping - Whether the user is currently typing
   * @returns Formatted typing message object
   */
  const createTypingMessage = (conversationId: number, to: number, isTyping: boolean): TypingMessage => ({
    type: "typing",
    conversationId,
    to,
    isTyping,
    timestamp: new Date().toISOString(),
  });

  /**
   * Creates a type-safe message read notification for WebSocket transmission
   * @param conversationId - The ID of the conversation
   * @param messageId - The ID of the message that was read
   * @param to - The user ID to notify about the read status
   * @returns Formatted message read notification object
   */
  const createMessageReadMessage = (conversationId: number, messageId: number, to: number): MessageReadMessage => ({
    type: "message_read",
    conversationId,
    messageId,
    to,
    timestamp: new Date().toISOString(),
  });

  /**
   * Creates a heartbeat message for connection keep-alive
   * @returns Formatted heartbeat message object
   */
  const createHeartbeatMessage = (): HeartbeatMessage => ({
    type: "heartbeat",
    timestamp: new Date().toISOString(),
  });

  /**
   * Creates a type-safe new message notification for WebSocket transmission
   * Used when a new chat message is sent between users
   * @param conversationId - The ID of the conversation
   * @param message - The complete message object from the database
   * @param to - The user ID(s) to send the message to
   * @param from - The user ID who sent the message (optional, will be set by server)
   * @returns Formatted new message notification object
   */
  const createNewMessageMessage = (conversationId: number, message: any, to: number | number[], from?: number): NewMessageMessage => ({
    type: "new_message",
    conversationId,
    message,
    to,
    from,
    timestamp: new Date().toISOString(),
  });

  /**
   * Creates a type-safe new conversation notification for WebSocket transmission
   * Used when a new conversation is created between users
   * @param conversation - The complete conversation object from the database
   * @param to - The user ID(s) to notify about the new conversation
   * @param from - The user ID who created the conversation (optional, will be set by server)
   * @returns Formatted new conversation notification object
   */
  const createNewConversationMessage = (conversation: any, to: number | number[], from?: number): NewConversationMessage => ({
    type: "new_conversation",
    conversation,
    to,
    from,
    timestamp: new Date().toISOString(),
  });

  /**
   * Creates a type-safe connection status message for WebSocket transmission
   * Used to broadcast when users come online or go offline
   * @param userId - The user whose status changed
   * @param isOnline - Whether the user is now online or offline
   * @param to - Who to notify (defaults to "all" for global status updates)
   * @returns Formatted connection status message object
   */
  const createConnectionStatusMessage = (userId: number, isOnline: boolean, to: number | number[] | "all" = "all"): ConnectionStatusMessage => ({
    type: "connection_status",
    userId,
    isOnline,
    to,
    timestamp: new Date().toISOString(),
  });

  return {
    addPeer,
    removePeer,
    sendToPeers,
    sendToAll,
    sendMessage,
    handleIncomingMessages,
    isUserOnline,
    // Type-safe message creators
    createTypingMessage,
    createMessageReadMessage,
    createHeartbeatMessage,
    createNewMessageMessage,
    createNewConversationMessage,
    createConnectionStatusMessage,
    // Client-side handling
    handleOutgoingMessages,
  };
};
