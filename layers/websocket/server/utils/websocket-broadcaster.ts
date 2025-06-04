import type { Peer } from "../api/_ws/connection";
import type { IncomingWebSocketMessage, NewMessageEvent, NewConversationEvent, TypingEvent, MessageReadEvent } from "~~/shared/types/websocket";
import type { ConversationWithUserAndMessages, MessageWithUser } from "~~/shared/types/conversation";

// Global peers map - should be shared across the application
export const peers = new Map<number, Set<Peer>>();

/**
 * Add a peer WebSocket connection for a user
 */
export function addPeer(userId: number, peer: Peer) {
  if (!peers.has(userId)) {
    peers.set(userId, new Set());
  }
  peers.get(userId)!.add(peer);
}

/**
 * Remove a peer WebSocket connection for a user
 */
export function removePeer(userId: number, peer: Peer) {
  const userPeers = peers.get(userId);
  if (userPeers) {
    userPeers.delete(peer);
    if (userPeers.size === 0) {
      peers.delete(userId);
    }
  }
}

/**
 * Get all peer connections for a user
 */
export function getUserPeers(userId: number): Set<Peer> | undefined {
  return peers.get(userId);
}

/**
 * Send a WebSocket message to specific users
 */
function sendToUsers(userIds: number[], message: IncomingWebSocketMessage) {
  const messageString = JSON.stringify(message);

  for (const userId of userIds) {
    const userPeers = getUserPeers(userId);

    if (userPeers) {
      for (const peer of userPeers) {
        try {
          peer.send(messageString);
        } catch (error) {
          console.error(`Error sending message to user ${userId}:`, error);
          // Remove the peer if sending fails
          removePeer(userId, peer);
        }
      }
    }
  }
}

/**
 * Broadcast a new message to conversation participants
 */
export function broadcastNewMessage(conversationId: number, message: MessageWithUser, excludeUserId?: number) {
  const event: NewMessageEvent = {
    type: "new_message",
    timestamp: new Date().toISOString(),
    data: {
      conversationId,
      message,
    },
  };

  // Send to both sender and receiver, but exclude the sender if specified
  const recipients = [message.senderId, message.receiverId];
  const filteredRecipients = excludeUserId ? recipients.filter((id) => id !== excludeUserId) : recipients;

  sendToUsers(filteredRecipients, event);
}

/**
 * Broadcast a new conversation to participants
 */
export function broadcastNewConversation(conversation: ConversationWithUserAndMessages, excludeUserId?: number) {
  const event: NewConversationEvent = {
    type: "new_conversation",
    timestamp: new Date().toISOString(),
    data: {
      conversation,
    },
  };

  // Send to both participants
  const recipients = [conversation.sender.id, conversation.receiver.id];
  const filteredRecipients = excludeUserId ? recipients.filter((id) => id !== excludeUserId) : recipients;

  sendToUsers(filteredRecipients, event);
}

/**
 * Send typing notification to conversation participants
 */
export function sendTypingNotification(conversationId: number, fromUserId: number, toUserId: number, isTyping: boolean) {
  const event: TypingEvent = {
    type: "typing",
    timestamp: new Date().toISOString(),
    data: {
      conversationId,
      userId: fromUserId,
      isTyping,
    },
  };

  sendToUsers([toUserId], event);
}

/**
 * Send message read notification to conversation participants
 */
export function sendMessageReadNotification(conversationId: number, messageId: number, readByUserId: number, toUserId: number) {
  const event: MessageReadEvent = {
    type: "message_read",
    timestamp: new Date().toISOString(),
    data: {
      conversationId,
      messageId,
      readByUserId,
    },
  };

  sendToUsers([toUserId], event);
}
