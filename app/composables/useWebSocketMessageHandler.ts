import type { 
  IncomingWebSocketMessage, 
  WebSocketHandlers,
  NewMessageEvent,
  NewConversationEvent,
  TypingEvent,
  MessageReadEvent 
} from '~~/shared/types/websocket';

/**
 * Composable for handling WebSocket messages with proper typing
 */
export function useWebSocketMessageHandler() {
  
  /**
   * Parse and handle incoming WebSocket messages
   */
  function handleWebSocketMessage(
    rawMessage: string, 
    handlers: Partial<WebSocketHandlers>
  ): void {
    try {
      const message: IncomingWebSocketMessage = JSON.parse(rawMessage);
      
      switch (message.type) {
        case 'new_message':
          if (handlers.onNewMessage) {
            handlers.onNewMessage(message as NewMessageEvent);
          }
          break;
          
        case 'new_conversation':
          if (handlers.onNewConversation) {
            handlers.onNewConversation(message as NewConversationEvent);
          }
          break;
          
        case 'typing':
          if (handlers.onTyping) {
            handlers.onTyping(message as TypingEvent);
          }
          break;
          
        case 'message_read':
          if (handlers.onMessageRead) {
            handlers.onMessageRead(message as MessageReadEvent);
          }
          break;
          
        default:
          console.warn('Unknown WebSocket message type:', message);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error, 'Raw message:', rawMessage);
    }
  }

  return {
    handleWebSocketMessage,
  };
}
