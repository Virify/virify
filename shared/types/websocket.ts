import type { ConversationWithUserAndMessages, MessageWithUser } from './conversation';

// Base WebSocket message structure
export interface BaseWebSocketMessage {
  type: string;
  timestamp: string;
}

// Incoming message types (from server to client)
export interface NewMessageEvent extends BaseWebSocketMessage {
  type: 'new_message';
  data: {
    conversationId: number;
    message: MessageWithUser;
  };
}

export interface NewConversationEvent extends BaseWebSocketMessage {
  type: 'new_conversation';
  data: {
    conversation: ConversationWithUserAndMessages;
  };
}

export interface TypingEvent extends BaseWebSocketMessage {
  type: 'typing';
  data: {
    conversationId: number;
    userId: number;
    isTyping: boolean;
  };
}

export interface MessageReadEvent extends BaseWebSocketMessage {
  type: 'message_read';
  data: {
    conversationId: number;
    messageId: number;
    readByUserId: number;
  };
}

// Union type for all incoming WebSocket messages
export type IncomingWebSocketMessage = 
  | NewMessageEvent 
  | NewConversationEvent 
  | TypingEvent 
  | MessageReadEvent;

// Outgoing message types (from client to server)
export interface TypingNotification {
  type: 'typing';
  conversationId: number;
  toUserId: number; // Added this field for proper routing
  isTyping: boolean;
}

export interface MessageReadNotification {
  type: 'message_read';
  conversationId: number; // Added this field for proper routing
  messageId: number;
  toUserId: number; // Added this field for proper routing
}

// Union type for all outgoing WebSocket messages
export type OutgoingWebSocketMessage = 
  | TypingNotification 
  | MessageReadNotification;

// Helper types for message handling
export type WebSocketMessageHandler<T extends IncomingWebSocketMessage> = (message: T) => void;

export interface WebSocketHandlers {
  onNewMessage: WebSocketMessageHandler<NewMessageEvent>;
  onNewConversation: WebSocketMessageHandler<NewConversationEvent>;
  onTyping: WebSocketMessageHandler<TypingEvent>;
  onMessageRead: WebSocketMessageHandler<MessageReadEvent>;
}
