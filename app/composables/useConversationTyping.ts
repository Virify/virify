/**
 * Typing status management for conversations
 * Handles typing indicators and status broadcasting
 */
export function useConversationTyping(
  conversationState: ReturnType<typeof useConversationState>,
  conversationEvents: ReturnType<typeof useConversationEvents>
) {
  const { currentUserId, allConversations } = conversationState;
  const { wsConnection, wsComposable } = conversationEvents;

  // Typing state
  const typingUsers = ref<Record<number, boolean>>({});

  // Typing timeout for debouncing
  let typingTimeout: NodeJS.Timeout | null = null;

  /**
   * Handle typing indicators from other users
   * Updates the typing status for display in UI
   */
  function handleTypingEvent(from: number, conversationId: number, isTyping: boolean) {
    if (from !== currentUserId.value) {
      typingUsers.value[from] = isTyping;
      
      // Clear typing status after a timeout
      if (isTyping) {
        setTimeout(() => {
          typingUsers.value[from] = false;
        }, 5000); // Clear after 5 seconds
      }
    }
  }

  /**
   * Check if another user is typing in a conversation
   */
  function isUserTyping(conversationId: number): boolean {
    if (!currentUserId.value) return false;
    
    return Object.entries(typingUsers.value).some(([userId, isTyping]) => 
      isTyping && Number(userId) !== currentUserId.value
    );
  }

  /**
   * Send typing status to other users in a conversation
   */
  function sendTypingStatus(conversationId: number, isTyping: boolean) {
    if (!currentUserId.value || !import.meta.client || !wsComposable) return;

    const conversation = allConversations.value.find(c => c.id === conversationId);
    if (!conversation) return;

    const otherUserId = getOtherUserId(conversation, currentUserId.value);
    if (!otherUserId) return;

    // Clear any existing typing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      typingTimeout = null;
    }

    if (isTyping) {
      // Debounce typing start to avoid spam
      typingTimeout = setTimeout(() => {
        const typingMessage = wsComposable!.createTypingMessage(conversationId, otherUserId, true);
        if (wsConnection?.send) {
          wsConnection.send(JSON.stringify(typingMessage));
        }
      }, 300);
    } else {
      // Send stop typing immediately for responsive UX
      const typingMessage = wsComposable.createTypingMessage(conversationId, otherUserId, false);
      if (wsConnection?.send) {
        wsConnection.send(JSON.stringify(typingMessage));
      }
    }
  }

  return {
    typingUsers: readonly(typingUsers),
    handleTypingEvent,
    isUserTyping,
    sendTypingStatus,
  };
}
