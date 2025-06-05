import type { TypingMessage, NewMessageMessage, MessageReadMessage, HeartbeatMessage, WebSocketMessage } from "../../../shared/types/websocket";

// Client-side event types
export interface WebSocketEvents {
  onNewMessage: (data: { conversationId: number; message: any }) => void;
  onNewConversation: (data: { conversation: any }) => void;
  onTyping: (data: { from: number; conversationId: number; isTyping: boolean }) => void;
  onMessageRead: (data: { conversationId: number; messageId: number; from: number }) => void;
}

// Global singleton peers Map - shared across all instances
const globalPeers = new Map<number, Set<{ send: (data: string) => void; close: () => void }>>();

/**
 * Simple WebSocket composable - handles ALL messages for client and server
 */
export const useWebSocketServer = () => {
  // Use the global singleton peers Map
  const peers = globalPeers;

  // Add a user connection
  const addPeer = (userId: number, peer: { send: (data: string) => void; close: () => void }) => {
    console.log("🔗 Adding peer for user:", userId);
    if (!peers.has(userId)) {
      peers.set(userId, new Set());
    }
    peers.get(userId)!.add(peer);
    console.log("👥 Current peers after add:", Array.from(peers.keys()));
  };

  // Remove a user connection
  const removePeer = (userId: number, peer: { send: (data: string) => void; close: () => void }) => {
    console.log("🔌 Removing peer for user:", userId);
    const userPeers = peers.get(userId);
    if (userPeers) {
      userPeers.delete(peer);
      if (userPeers.size === 0) {
        peers.delete(userId);
      }
    }
    console.log("👥 Current peers after remove:", Array.from(peers.keys()));
  };

  // Send to specific users
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

  // Send to all connected users
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

  // Main send function - routes based on message content
  const sendMessage = (message: any) => {
    if (!message.timestamp) {
      message.timestamp = new Date().toISOString();
    }

    console.log("📨 sendMessage called with:", message);
    console.log("👥 Current peers:", Array.from(peers.keys()));

    if (message.to === "all") {
      console.log("📡 Broadcasting to all users");
      sendToAll(message);
    } else if (message.to) {
      console.log("📤 Sending to specific users:", message.to);
      sendToPeers(message.to, message);
    } else {
      console.log("⚠️ No recipients specified for message");
    }
  };

  // Handle incoming messages - type-safe with proper message interfaces
  const handleMessage = (rawMessage: string, fromUserId: number) => {
    try {
      const message = JSON.parse(rawMessage);
      message.from = fromUserId;

      // Type-safe message handling based on message structure
      switch (message.type) {
        case "typing": {
          const typingMsg: TypingMessage = {
            type: "typing",
            conversationId: message.conversationId,
            from: fromUserId,
            to: message.to,
            isTyping: message.isTyping,
            timestamp: new Date().toISOString(),
          };

          if (typingMsg.conversationId && typingMsg.to && typingMsg.isTyping !== undefined) {
            sendMessage(typingMsg);
          }
          break;
        }

        case "message_read": {
          const readMsg: MessageReadMessage = {
            type: "message_read",
            conversationId: message.conversationId,
            messageId: message.messageId,
            from: fromUserId,
            to: message.to,
            timestamp: new Date().toISOString(),
          };

          if (readMsg.conversationId && readMsg.messageId && readMsg.to) {
            sendMessage(readMsg);
          }
          break;
        }

        case "new_message": {
          const newMsg: NewMessageMessage = {
            type: "new_message",
            conversationId: message.conversationId,
            message: message.message,
            from: fromUserId,
            to: message.to,
            timestamp: new Date().toISOString(),
          };

          if (newMsg.to && newMsg.message && newMsg.conversationId) {
            sendMessage(newMsg);
          }
          break;
        }

        case "heartbeat": {
          // Respond to heartbeat
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

  // Get online status
  const isUserOnline = (userId: number) => {
    return peers.has(userId) && peers.get(userId)!.size > 0;
  };

  // Type-safe client message creation helpers
  const createTypingMessage = (conversationId: number, to: number, isTyping: boolean): TypingMessage => ({
    type: "typing",
    conversationId,
    to,
    isTyping,
    timestamp: new Date().toISOString(),
  });

  const createMessageReadMessage = (conversationId: number, messageId: number, to: number): MessageReadMessage => ({
    type: "message_read",
    conversationId,
    messageId,
    to,
    timestamp: new Date().toISOString(),
  });

  const createHeartbeatMessage = (): HeartbeatMessage => ({
    type: "heartbeat",
    timestamp: new Date().toISOString(),
  });

  // Client-side message handling
  const handleIncomingMessage = (rawData: string, events: WebSocketEvents) => {
    if (!rawData || rawData === "ping") return;

    console.log("📥 Received WebSocket message:", rawData);

    try {
      const wsMessage: WebSocketMessage = JSON.parse(rawData);
      console.log("📋 Parsed message:", wsMessage);

      switch (wsMessage.type) {
        case "new_message":
          console.log("💬 Handling new message");
          if (wsMessage.conversationId && wsMessage.message) {
            events.onNewMessage({
              conversationId: wsMessage.conversationId,
              message: wsMessage.message,
            });
          }
          break;
        case "new_conversation":
          console.log("🆕 Handling new conversation");
          if (wsMessage.conversation) {
            events.onNewConversation({
              conversation: wsMessage.conversation,
            });
          }
          break;
        case "typing":
          console.log("⌨️ Handling typing");
          if (wsMessage.from && wsMessage.conversationId && wsMessage.isTyping !== undefined) {
            events.onTyping({
              from: wsMessage.from,
              conversationId: wsMessage.conversationId,
              isTyping: wsMessage.isTyping,
            });
          }
          break;
        case "message_read":
          console.log("📖 Handling message read");
          if (wsMessage.from && wsMessage.conversationId && wsMessage.messageId) {
            events.onMessageRead({
              from: wsMessage.from,
              conversationId: wsMessage.conversationId,
              messageId: wsMessage.messageId,
            });
          }
          break;
        default:
          console.warn("Unknown message type:", wsMessage.type);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };

  return {
    addPeer,
    removePeer,
    sendToPeers,
    sendToAll,
    sendMessage,
    handleMessage,
    isUserOnline,
    // Type-safe message creators
    createTypingMessage,
    createMessageReadMessage,
    createHeartbeatMessage,
    // Client-side handling
    handleIncomingMessage,
  };
};
