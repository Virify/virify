import type { ConversationWithUserAndMessages, MessageWithUser } from "./conversation";
import type { UserItemsAggregates } from "./notifications";

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
  conversation?: ConversationWithUserAndMessages;
  to: number | number[];
}

export interface NewConversationMessage extends BaseWebSocketMessage {
  type: "new_conversation";
  conversation: ConversationWithUserAndMessages;
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
 * Union type of all possible WebSocket messages
 */
export type WebSocketMessage = TypingMessage | NewMessageMessage | NewConversationMessage | MessageReadMessage | ConnectionStatusMessage | AggregateUpdateMessage;

/**
 * Message types - determined by the 'type' field
 */
export type WebSocketMessageType = "new_message" | "new_conversation" | "typing" | "message_read" | "connection_status" | "aggregate_update";

/**
 * Handler function type for processing messages
 */
export type WebSocketMessageHandler = (message: WebSocketMessage) => void | Promise<void>;

/**
 * Handlers map for different message types
 */
export type WebSocketHandlers = Partial<Record<WebSocketMessageType, WebSocketMessageHandler>>;
