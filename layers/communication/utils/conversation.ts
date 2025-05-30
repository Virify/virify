import type { ConversationWithUserAndMessages } from '~~/shared/types/conversation';

interface ConversationPoV {
  name: string;
  otherUserId?: number;
}

/**
 * Determine the other participant in a conversation from the current user's perspective.
 * 
 * @param conversation - The conversation object.
 * @param currentUserId - The ID of the current user.
 * @returns An object containing the name and ID of the other participant.
 */
export const getConversationPoV = (conversation: ConversationWithUserAndMessages, currentUserId: string | number | undefined): ConversationPoV => {
  if (currentUserId === undefined || !conversation?.sender || !conversation?.receiver) {
    return {
      name: conversation?.sender?.email || conversation?.receiver?.email || 'Unknown Participant',
      otherUserId: undefined
    };
  }
  if (String(conversation.sender.id) === String(currentUserId)) {
    return {
      name: conversation.receiver.email,
      otherUserId: conversation.receiver.id
    };
  } else {
    return {
      name: conversation.sender.email,
      otherUserId: conversation.sender.id
    };
  }
};
