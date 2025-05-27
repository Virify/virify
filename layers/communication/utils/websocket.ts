import type { ConversationWithUserAndMessages, MessageWithUser } from '~~/shared/types/conversation';

export type MessageHandlerActionType =
  | 'ADD_CONVERSATION'
  | 'ADD_MESSAGE_TO_CONVERSATION'
  | 'USER_TYPING'
  | 'MESSAGE_READ'
  | 'UNKNOWN_MESSAGE'
  | 'NO_ACTION';

export interface MessageHandlerResult {
  action: MessageHandlerActionType;
  conversationId?: string | number;
  payload?: ConversationWithUserAndMessages | MessageWithUser | any;
  originalMessage?: ParsedWebSocketMessage;
}

export interface ParsedWebSocketMessage {
  type: 'new_conversation' | 'new_message' | 'typing' | 'read' | 'unknown';
  payload: any; // Can be specific based on type, e.g., MessageWithUser for new_message
  conversationId?: string | number; // Optional, as not all messages might have it (e.g. a general error)
}

export function processIncomingMessage(parsedMessage: ParsedWebSocketMessage): MessageHandlerResult {
  console.log('Processing parsed message in util:', parsedMessage);

  switch (parsedMessage.type) {
    case 'typing':
      console.log('User is typing (in util):', parsedMessage.payload, 'in conversation:', parsedMessage.conversationId);
      return {
        action: 'USER_TYPING',
        conversationId: parsedMessage.conversationId,
        payload: parsedMessage.payload,
        originalMessage: parsedMessage,
      };

    case 'read':
      console.log('Message read (in util):', parsedMessage.payload, 'in conversation:', parsedMessage.conversationId);
      return {
        action: 'MESSAGE_READ',
        conversationId: parsedMessage.conversationId,
        payload: parsedMessage.payload,
        originalMessage: parsedMessage,
      };

    case 'new_conversation':
      if (parsedMessage.conversationId && parsedMessage.payload) {
        console.log('Identified new conversation (in util):', parsedMessage.conversationId);
        return {
          action: 'ADD_CONVERSATION',
          conversationId: parsedMessage.conversationId,
          payload: parsedMessage.payload as ConversationWithUserAndMessages,
          originalMessage: parsedMessage,
        };
      } else {
        console.warn('New conversation message missing conversationId or payload (in util):', parsedMessage);
        return { action: 'NO_ACTION', originalMessage: parsedMessage };
      }

    case 'new_message':
      if (parsedMessage.conversationId && parsedMessage.payload) {
        console.log('Identified new message for conversation (in util):', parsedMessage.conversationId);
        return {
          action: 'ADD_MESSAGE_TO_CONVERSATION',
          conversationId: parsedMessage.conversationId,
          payload: parsedMessage.payload as MessageWithUser,
          originalMessage: parsedMessage,
        };
      } else {
        console.warn('New message missing conversationId or payload (in util):', parsedMessage);
        return { action: 'NO_ACTION', originalMessage: parsedMessage };
      }

    case 'unknown':
    default:
      console.log('Unknown or unhandled message format (in util):', parsedMessage.payload);
      return {
        action: 'UNKNOWN_MESSAGE',
        payload: parsedMessage.payload,
        originalMessage: parsedMessage,
      };
  }
}

/**
 * Parses the raw WebSocket message string and determines its type and payload.
 *
 * @param rawMessage - The raw string data received from the WebSocket.
 * @returns A ParsedWebSocketMessage object.
 */
export const parseWebSocketMessage = (rawMessage: string): ParsedWebSocketMessage => {
  try {
    const data = JSON.parse(rawMessage);

    if (data.conversationId && data.newConversation) {
      return {
        type: 'new_conversation',
        payload: data.newConversation as ConversationWithUserAndMessages,
        conversationId: data.conversationId,
      };
    } else if (data.conversationId && data.messageData) {
      return {
        type: 'new_message',
        payload: data.messageData as MessageWithUser,
        conversationId: data.conversationId,
      };
    } else if (data.type === 'typing') {
      return {
        type: 'typing',
        payload: data,
        conversationId: data.conversationId,
      };
    } else if (data.type === 'read') {
      return {
        type: 'read',
        payload: data,
        conversationId: data.conversationId,
      };
    } else {
      return { type: 'unknown', payload: data };
    }
  } catch (error) {
    console.error('Error parsing WebSocket message:', error);
    return { type: 'unknown', payload: rawMessage };
  }
};
