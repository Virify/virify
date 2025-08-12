import { useWebSocket } from "@vueuse/core";

/**
 * WebSocket event handling for conversations
 * Manages real-time updates for messages, new conversations, and other events
 */
export function useConversationEvents(conversationState: ReturnType<typeof useConversationState>) {
  const config = useRuntimeConfig();
  const { allConversations, currentUserId, addConversation } = conversationState;

  // WebSocket connection (only on client side)
  let wsConnection: ReturnType<typeof useWebSocket> | null = null;
  let wsComposable: ReturnType<typeof useWebSocketServer> | null = null;

  // Initialize WebSocket connection on client
  if (import.meta.client) {
    wsConnection = useWebSocket(config.public.WS_BASE_URL + "/api/_ws/connection");
    wsComposable = useWebSocketServer();
  }

  /**
   * WebSocket event handlers for real-time updates
   * These handle incoming messages, new conversations, typing, and read status
   */
  const webSocketEvents: WebSocketEvents = {
    /**
     * Handle new messages in conversations
     * Updates the conversation with the new message and moves it to the top
     */
    onNewMessage: ({ conversationId, message: newMessage }) => {
      if (!allConversations.value || !currentUserId.value) return;

      const conversation = allConversations.value.find((c: ConversationWithUserAndMessages) => c.id === conversationId);
      if (!conversation) return;

      // Prevent duplicate messages
      if (conversation.messages.some((m: any) => m.id === newMessage.id)) return;

      // Add message and update conversation timestamp
      conversation.messages.push(newMessage);
      conversation.updatedAt = new Date();

      // Move conversation to top of list
      const index = allConversations.value.indexOf(conversation);
      if (index > 0) {
        allConversations.value.splice(index, 1);
        allConversations.value.unshift(conversation);
      }
    },

    /**
     * Handle new conversation creation
     * Adds the new conversation to the top of the list
     */
    onNewConversation: ({ conversation }) => {
      if (allConversations.value && currentUserId.value) {
        // Check if conversation already exists to prevent duplicates
        const existingIndex = allConversations.value.findIndex(c => c.id === conversation.id);
        if (existingIndex === -1) {
          addConversation(conversation);
        }
      }
    },

    /**
     * Handle typing indicators from other users
     * This will be handled by the typing composable
     */
    onTyping: ({ from, conversationId, isTyping }) => {
      // This will be handled by useConversationTyping
    },

    /**
     * Handle message read confirmations - TODO: Implement when backend support is added
     */
    onMessageRead: ({ conversationId, messageId, from }) => {
      // TODO: Implement read status when backend support is added
      console.log('Message read event received:', { conversationId, messageId, from });
    },
  };

  /**
   * Set up WebSocket message handling on client
   */
  if (import.meta.client && wsConnection && wsComposable) {
    watchEffect(() => {
      if (wsConnection.data.value && typeof wsConnection.data.value === 'string') {
        wsComposable.handleOutgoingMessages(wsConnection.data.value, webSocketEvents);
      }
    });
  }

  return {
    wsConnection,
    wsComposable,
    webSocketEvents,
  };
}
