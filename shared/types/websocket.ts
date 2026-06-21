import type { ConversationWithMinimalListing, MessageWithUser } from "./conversation";
import type { UserItemsAggregates, UserNotification } from "./notifications";

/**
 * Base WebSocket message structure
 */
export interface BaseWebSocketMessage {
  type: WebSocketMessageType;
  to?: number | number[] | "all";
  from?: number;
  timestamp?: string;
}

/**
 * Specific message interfaces for each type
 */
export interface TypingMessage extends BaseWebSocketMessage {
  type: "typing";
  conversationId: number;
  isTyping: boolean;
  to: number;
}

export interface NewMessageMessage extends BaseWebSocketMessage {
  type: "new_message";
  conversationId: number;
  message: MessageWithUser;
  conversation?: ConversationWithMinimalListing;
  to: number | number[];
}

export interface NewConversationMessage extends BaseWebSocketMessage {
  type: "new_conversation";
  conversation: ConversationWithMinimalListing;
  to: number | number[];
}

export interface MessageReadMessage extends BaseWebSocketMessage {
  type: "message_read";
  conversationId: number;
  messageId: number;
  to: number;
}

export interface ConnectionStatusMessage extends BaseWebSocketMessage {
  type: "connection_status";
  userId: number;
  isOnline: boolean;
  to: number | number[] | "all";
}

export interface AggregateUpdateMessage extends BaseWebSocketMessage {
  type: "aggregate_update";
  aggregateType: keyof UserItemsAggregates;
  operation: "add" | "remove" | "update";
  to: number;
}

/**
 * Ownership verification result - emitted after admin approves/denies documents
 * Carries the persisted notification so the client can update the panel and badge.
 */
export interface OwnershipVerificationResultMessage extends BaseWebSocketMessage {
  type: "ownership_verification_result";
  notification: UserNotification;
  draftListingId: number;
  approved: boolean;
  to: number;
}

/**
 * Notification created message - emitted after server persists a notification
 */
export interface NotificationNewMessage extends BaseWebSocketMessage {
  type: "notification_new";
  notification: UserNotification;
  to: number | number[];
}

/**
 * Conversation presence message - sent from client to server
 * Indicates whether the user is currently viewing a conversation
 */
export interface ConversationPresenceMessage extends BaseWebSocketMessage {
  type: "conversation_presence";
  conversationId: number | null;
  open: boolean;
}

/**
 * Union type of all possible WebSocket messages
 */
export type WebSocketMessage =
  | TypingMessage
  | NewMessageMessage
  | NewConversationMessage
  | MessageReadMessage
  | ConnectionStatusMessage
  | AggregateUpdateMessage
  | NotificationNewMessage
  | OwnershipVerificationResultMessage
  | ConversationPresenceMessage;

/**
 * Message types - determined by the 'type' field
 */
export type WebSocketMessageType =
  | "new_message"
  | "new_conversation"
  | "typing"
  | "message_read"
  | "connection_status"
  | "aggregate_update"
  | "notification_new"
  | "ownership_verification_result"
  | "conversation_presence";

/**
 * Handler function type for processing messages
 */
export type WebSocketMessageHandler = (message: WebSocketMessage) => void | Promise<void>;

/**
 * Handlers map for different message types
 */
export type WebSocketHandlers = Partial<
  Record<WebSocketMessageType, WebSocketMessageHandler>
>;
