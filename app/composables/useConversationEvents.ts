import { useWebSocket } from "@vueuse/core";

/**
 * WebSocket event handling for conversations
 * Manages real-time updates for messages, new conversations, and other events
 */
export function useConversationEvents(conversationState: ReturnType<typeof useConversationState>) {
  const config = useRuntimeConfig();
  const { allConversations, currentUserId, addConversation, updateConversation } = conversationState;

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
    onNewMessage: ({ conversationId, message: newMessage, conversation: conversationData }) => {
      if (!allConversations.value || !currentUserId.value) return;

      const updatedList = handleNewMessageInList(
        allConversations.value,
        newMessage as MessageWithUser,
        conversationData as ConversationWithUserAndMessages | undefined
      );

      if (updatedList !== allConversations.value) {
        allConversations.value = updatedList;
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
     * Handle message read confirmations
     * Updates the read status of messages in the conversation state
     */
    onMessageRead: ({ conversationId, messageId, from }) => {
      if (!allConversations.value) return;

      const updatedList = handleMessageReadInList(allConversations.value, conversationId, messageId);
      if (updatedList) {
        allConversations.value = updatedList;
      }
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

  /**
   * Mark a message as read
   * @param messageId - The ID of the message to mark as read
   * @param conversationId - The ID of the conversation the message belongs to
   */
  const markMessageAsRead = async (messageId: number, conversationId: number) => {
    try {
      // Optimistically update the local state first for immediate UI feedback
      if (allConversations.value) {
        const updatedList = handleMessageReadInList(allConversations.value, conversationId, messageId);
        if (updatedList) {
          allConversations.value = updatedList;
        }
      }

      // Then make the API call
      await $fetch('/api/conversation/mark-read', {
        method: 'POST',
        body: { messageId, conversationId },
      });
      
      // The WebSocket event will handle notifying other users
    } catch (error) {
      console.error('Error marking message as read:', error);
      
      // Revert the optimistic update on error
      if (allConversations.value) {
        const conversation = allConversations.value.find((c: ConversationWithUserAndMessages) => c.id === conversationId);
        if (conversation) {
          const message = conversation.messages.find((m: any) => m.id === messageId);
          if (message) {
            message.isRead = false;
            // Force reactivity by creating a new array reference
            allConversations.value = [...allConversations.value];
          }
        }
      }
    }
  };

  return {
    wsConnection,
    wsComposable,
    webSocketEvents,
    markMessageAsRead,
  };
}
