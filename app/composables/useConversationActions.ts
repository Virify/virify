/**
 * Conversation actions like sending messages, marking as read, etc.
 * Handles user interactions with conversations
 */
export function useConversationActions(conversationState: ReturnType<typeof useConversationState>) {
  const { currentUserId, allConversations } = conversationState;

  /**
   * Send a reply message in a conversation
   */
  async function sendReply(conversationId: number, content: string) {
    if (!content.trim() || !currentUserId.value) {
      throw new Error("Message content is required");
    }

    try {
      const newMessage = await $fetch<MessageWithUser>("/api/conversation/reply/", {
        method: "POST",
        body: { message: content, conversationId },
      });

      // Don't add the message here - let WebSocket events handle it
      // This prevents duplicates when WebSocket also adds the same message

      return newMessage;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  /**
   * Mark a conversation as read - TODO: Implement when backend support is added
   */
  async function markAsRead(conversationId: number) {
    // TODO: Implement when backend read status API is available
    console.log("Mark as read requested for conversation:", conversationId);
  }

  /**
   * Get unread message count for a conversation - TODO: Implement when backend support is added
   */
  function getUnreadCount(conversationId: number): number {
    // TODO: Implement when backend read status support is added
    return 0;
  }

  /**
   * Get total unread conversations count
   */
  const unreadConversationsCount = computed(() => {
    // TODO: Implement when backend read status support is added
    return 0;
  });

  return {
    sendReply,
    markAsRead,
    getUnreadCount,
    unreadConversationsCount,
  };
}
