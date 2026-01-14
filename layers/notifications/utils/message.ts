
/**
 * Extracts and processes unread messages from a list of conversations
 */
export function processUnreadMessages(
  conversations: ConversationWithUserAndMessages[], 
  currentUserId?: number
): MessageWithUser[] {
  if (!currentUserId) return [];

  const messages: MessageWithUser[] = [];

  conversations.forEach(conv => {
    conv.messages?.forEach(msg => {
      if (!msg.isRead && msg.receiverId === currentUserId) {
        messages.push({
          ...msg,
          conversationId: conv.id 
        } as MessageWithUser);
      }
    });
  });

  return messages.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
