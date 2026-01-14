
/**
 * Mark a specific message as read in a conversation
 * Returns the updated conversation or null if not found
 */
export function markMessageAsReadInConversation(
  conversations: ConversationWithMinimalListing[],
  conversationId: number,
  messageId: number
): ConversationWithMinimalListing | null {
  const index = conversations.findIndex(c => c.id === conversationId);
  if (index === -1) return null;

  const conversation = conversations[index];
  if (!conversation?.messages) return null;

  const messageIndex = conversation.messages.findIndex(m => m.id === messageId);
  if (messageIndex === -1) return null;

  const message = conversation.messages[messageIndex];
  if (!message || message.isRead) return null;

  // Update message read status immutably
  const newMessages = [...conversation.messages];
  newMessages[messageIndex] = { ...message, isRead: true };

  return { ...conversation, messages: newMessages };
}

/**
 * Update a conversation in the list (for optimistic updates)
 */
export function updateConversationInList(
  conversations: ConversationWithMinimalListing[],
  conversationId: number,
  updated: ConversationWithMinimalListing
): ConversationWithMinimalListing[] {
  const newList = [...conversations];
  const index = newList.findIndex(c => c.id === conversationId);
  if (index !== -1) {
    newList[index] = updated;
  }
  return newList;
}

/**
 * Get unread message count for a conversation
 */
export function getUnreadMessageCountInConversation(
  conversation: ConversationWithMinimalListing,
  currentUserId: number
): number {
  if (!conversation.messages) return 0;
  return conversation.messages.filter(
    m => !m.isRead && m.receiverId === currentUserId
  ).length;
}
