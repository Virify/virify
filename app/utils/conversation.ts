import type { ConversationWithUserAndMessages, MessageWithUser } from '~~/shared/types/conversation';

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

/**
 * Determine the sender of the message from the current user's perspective.
 * 
 * @param convoMessage - The message object.
 * @param currentUserId - The ID of the current user.
 * @returns 'You' if the sender is the current user, otherwise the sender's email.
 */
export const getConvoMessagePoV = (convoMessage: MessageWithUser, currentUserId: string | number | undefined): string => {
  if (currentUserId === undefined || !convoMessage?.sender) return convoMessage?.sender?.email || 'Unknown Sender';
  if (String(convoMessage.sender.id) === String(currentUserId)) {
    return 'You';
  } else {
    return convoMessage.sender.email;
  }
};

/**
 * Formats a message creation timestamp to a time string (HH:MM).
 * 
 * @param createdAt - The timestamp of message creation.
 * @returns Formatted time string.
 */
export const formatMessageTimestampToTime = (createdAt?: string | Date): string => {
  if (!createdAt) return '';
  const date = new Date(createdAt);
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formats a message creation timestamp to a full date-time string.
 * 
 * @param createdAt - The timestamp of message creation.
 * @returns Formatted date-time string.
 */
export const formatMessageTimestamp = (createdAt?: string | Date): string => {
  if (!createdAt) return '';
  const date = new Date(createdAt);
  return date.toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};
