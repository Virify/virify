interface ConversationPoV {
  name: string;
  otherUserId?: number;
}

/**
 * Filter messages to exclude those from a specific conversation
 */
export const filterMessagesExcludingConversation = (messages: MessageWithUser[], conversationId: number): MessageWithUser[] => {
  return messages.filter(msg => msg.conversationId !== conversationId);
}

/**
 * Determine if we should notify the user about a new conversation
 */
export const shouldNotifyForNewConversation = (conversation: ConversationWithMinimalListing, currentUserId: number | undefined): boolean => {
  if (!currentUserId) return false;
  return conversation.sender.id !== currentUserId;
}

/**
 * Get the name of the sender of the conversation
 */
export const getConversationSenderName = (conversation: ConversationWithMinimalListing): string => {
  return conversation.sender?.username || 'Someone';
}

/**
 * Get the latest message from a conversation
 */
export const getConversationLatestMessage = (conversation: ConversationWithMinimalListing): MessageWithUser | null => {
  if (conversation.messages && conversation.messages.length > 0) {
    return conversation.messages[conversation.messages.length - 1] || null;
  }
  return null;
}

/**
 * Determine the other participant in a conversation from the current user's perspective.
 * 
 * @param conversation - The conversation object.
 * @param currentUserId - The ID of the current user.
 * @returns An object containing the name and ID of the other participant.
 */
export const getConversationPoV = (conversation: ConversationWithMinimalListing, currentUserId: string | number | undefined): ConversationPoV => {
  if (currentUserId === undefined || !conversation?.sender || !conversation?.receiver) {
    return {
      name: conversation?.sender?.username || conversation?.receiver?.username || 'Unknown Participant',
      otherUserId: undefined
    };
  }
  if (String(conversation.sender.id) === String(currentUserId)) {
    return {
      name: conversation.receiver.username || 'Unknown Participant',
      otherUserId: conversation.receiver.id
    };
  } else {
    return {
      name: conversation.sender.username || 'Unknown Participant',
      otherUserId: conversation.sender.id
    };
  }
};

/**
 * Determine the sender of the message from the current user's perspective.
 * 
 * @param convoMessage - The message object.
 * @param currentUserId - The ID of the current user.
 * @returns 'You' if the sender is the current user, otherwise the sender's username (or email if username not available).
 */
export const getConvoMessagePoV = (convoMessage: MessageWithUser, currentUserId: string | number | undefined): string => {
  if (currentUserId === undefined || !convoMessage?.sender) return convoMessage?.sender?.username || 'Unknown Sender';
  if (String(convoMessage.sender.id) === String(currentUserId)) {
    return 'You';
  } else {
    return convoMessage.sender.username || 'Unknown Sender';
  }
};

/**
 * 
 * @param message Message
 * @param currentUserId User ID
 * @returns Boolean indicating if the message was sent by the current user
 */
export const isMessageFromUser = (message: MessageWithUser, currentUserId: string | number): boolean => {
  return String(message.senderId) !== String(currentUserId)
}

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
 * Formats a message creation timestamp - shows only time if today, date+time if older.
 * 
 * @param createdAt - The timestamp of message creation.
 * @returns Formatted time string if today, date-time string if older.
 */
export const formatMessageTimestamp = (createdAt?: string | Date): string => {
  if (!createdAt) return '';
  const date = new Date(createdAt);
  const now = new Date();
  
  // Check if the message is from today
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    // Show only time for today's messages
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } else {
    // Show date and time for older messages
    return date.toLocaleString('en-GB', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
};

/**
 * Format a partner name from email by removing @ domain and replacing separators
 * 
 * @param name - The name or email to format
 * @returns Formatted name
 */
export const formatPartnerName = (name: string): string => {
  // If it's an email, just return the part before the @ symbol
  if (name.includes("@")) {
    const parts = name.split("@");
    return parts[0]?.replace(/[._-]/g, " ") || name;
  }
  return name;
};

/**
 * Get the last message from a conversation
 * 
 * @param conversation - The conversation object
 * @returns The last message or null if no messages
 */
export const getLastMessage = (conversation: ConversationWithMinimalListing): MessageWithUser | null => {
  if (conversation.messages && conversation.messages.length > 0) {
    return conversation.messages[conversation.messages.length - 1] || null;
  }
  return null;
};

/**
 * Get the content of the last message in a conversation
 * 
 * @param conversation - The conversation object
 * @returns The last message content or fallback text
 */
export const getLastMessageContent = (conversation: ConversationWithMinimalListing): string => {
  const lastMessage = getLastMessage(conversation);
  if (!lastMessage) return "No messages yet";
  if (lastMessage.content) return lastMessage.content;
  if (lastMessage.userMedia) return "📎 Attachment";
  return "No messages yet";
};

/**
 * Get the formatted time of the last message in a conversation
 * 
 * @param conversation - The conversation object
 * @returns Formatted time string or empty string
 */
export const getLastMessageTime = (conversation: ConversationWithMinimalListing): string => {
  const lastMessage = getLastMessage(conversation);
  return lastMessage ? formatMessageTimestampToTime(lastMessage.createdAt) : "";
};

/**
 * Update a conversation in an array and move it to the top
 * 
 * @param conversations - Array of conversations
 * @param conversationId - ID of conversation to update
 * @param updatedData - Partial data to update
 * @returns Updated conversations array
 */
export const updateConversationInArray = (
  conversations: ConversationWithMinimalListing[], 
  conversationId: number, 
  updatedData: Partial<ConversationWithMinimalListing>
): ConversationWithMinimalListing[] => {
  const index = conversations.findIndex(c => c.id === conversationId);
  
  if (index >= 0) {
    const existingConversation = conversations[index];
    if (!existingConversation) return conversations;
    
    // Create a new conversation object with updates
    const updatedConversation: ConversationWithMinimalListing = {
      ...existingConversation,
      ...updatedData,
      id: existingConversation.id,
      listingId: updatedData.listingId ?? existingConversation.listingId,
      createdAt: updatedData.createdAt ?? existingConversation.createdAt,
      updatedAt: updatedData.updatedAt ?? existingConversation.updatedAt,
      messages: updatedData.messages ?? existingConversation.messages,
      sender: updatedData.sender ?? existingConversation.sender,
      receiver: updatedData.receiver ?? existingConversation.receiver
    };
    
    conversations[index] = updatedConversation;
    
    // Move to top if it's not already there
    if (index > 0) {
      conversations.splice(index, 1);
      conversations.unshift(updatedConversation);
    }
  }
  
  return conversations;
};

/**
 * Add a conversation to an array, avoiding duplicates
 * 
 * @param conversations - Array of conversations
 * @param conversation - Conversation to add
 * @returns Updated conversations array
 */
export const addConversationToArray = (
  conversations: ConversationWithMinimalListing[], 
  conversation: ConversationWithMinimalListing
): ConversationWithMinimalListing[] => {
  // Check if conversation already exists
  const existingIndex = conversations.findIndex(c => c.id === conversation.id);
  
  if (existingIndex >= 0) {
    // Update existing conversation
    conversations[existingIndex] = conversation;
  } else {
    // Add new conversation to the beginning
    conversations.unshift(conversation);
  }
  
  return conversations;
};

/**
 * Sort conversations by unread status first, then by most recent activity
 * 
 * @param conversations - Array of conversations to sort
 * @param currentUserId - ID of the current user to determine unread messages
 * @returns Sorted conversations array (unread first, then by most recent activity)
 */
export const sortConversationsByUnreadAndRecency = (
  conversations: ConversationWithMinimalListing[], 
  currentUserId?: string | number
): ConversationWithMinimalListing[] => {
  return conversations.sort((a, b) => {
    const aHasUnread = a.messages.some(message => !message.isRead && message.senderId !== currentUserId);
    const bHasUnread = b.messages.some(message => !message.isRead && message.senderId !== currentUserId);
    
    // If one has unread and the other doesn't, prioritize the one with unread
    if (aHasUnread && !bHasUnread) return -1;
    if (!aHasUnread && bHasUnread) return 1;
    
    // If both have same unread status, sort by most recent activity (updatedAt)
    const aTime = new Date(a.updatedAt).getTime();
    const bTime = new Date(b.updatedAt).getTime();
    return bTime - aTime; // Most recent first
  });
};

/**
 * Sort and filter conversations based on the specified criteria
 * 
 * @param conversations - Array of conversations to sort/filter
 * @param sortBy - The sorting/filtering criteria
 * @param userId - The current user's ID
 * @returns Sorted/filtered conversations array
 */
export const sortConversations = (
  conversations: ConversationWithMinimalListing[], 
  sortBy: string, 
  userId?: number
): ConversationWithMinimalListing[] => {
  const conversationsCopy = [...conversations];

  switch (sortBy) {
    case "all":
      // Sort conversations using utility function (default behavior)
      return sortConversationsByUnreadAndRecency(conversationsCopy, userId);
    
    case "unread":
      // Show only unread conversations
      return conversationsCopy
        .filter(conversation => {
          // Check if there are unread messages for the current user
          return conversation.messages?.some(message => 
            !message.isRead && message.receiverId === userId
          );
        })
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    
    case "read":
      // Show only conversations with no unread messages for the current user
      return conversationsCopy
        .filter(conversation => {
          // Check if there are NO unread messages for the current user
          return !conversation.messages?.some(message => 
            !message.isRead && message.receiverId === userId
          );
        })
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    
    case "recent":
      // Sort by most recent updated conversation
      return conversationsCopy.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    
    case "oldest":
      // Sort by oldest updated conversation
      return conversationsCopy.sort((a, b) => 
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      );
    
    case "received":
      // Show only conversations where current user is the receiver
      return conversationsCopy
        .filter(conversation => conversation.receiver?.id === userId)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    
    case "sent":
      // Show only conversations where current user is the sender
      return conversationsCopy
        .filter(conversation => conversation.sender?.id === userId)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    
    default:
      // Default to all/relevance sorting
      return sortConversationsByUnreadAndRecency(conversationsCopy, userId);
  }
};

/**
 * Filter conversations by search term
 * Search by sender/receiver name or username, listing title, or last message content
 * 
 * @param conversations - Array of conversations
 * @param searchTerm - Term to search for
 * @returns Filtered array of conversations
 */
export const filterConversationsByTerm = (conversations: ConversationWithMinimalListing[], searchTerm: string): ConversationWithMinimalListing[] => {
  if (!searchTerm.trim()) return conversations;
  
  const term = searchTerm.trim().toLowerCase();
  return conversations.filter(c => {
    // Search by sender/receiver name or username, listing title, or last message content
    const senderUsername = c.sender?.username?.toLowerCase() || "";
    const receiverUsername = c.receiver?.username?.toLowerCase() || "";

    const lastMsg = c.messages && c.messages.length > 0 
      ? c.messages[c.messages.length-1]?.content?.toLowerCase() || ""
      : "";
      
    const address = c.listing?.property?.address?.fullAddress?.toLowerCase() || "";

    return (
      senderUsername.includes(term) ||
      receiverUsername.includes(term) ||
      lastMsg.includes(term) ||
      address.includes(term)
    );
  });
}

/**
 * Get newly-added messages between two lengths and return only those that are unread and sent by other users
 *
 * @param conversation - Conversation object
 * @param oldLen - Previous length of the messages array
 * @param newLen - New length of the messages array
 * @param currentUserId - ID of current user
 * @returns Array of messages that were newly added and need marking
 */
export const getNewUnreadMessagesFromOthers = (
  conversation: ConversationWithMinimalListing | null | undefined,
  oldLen: number | undefined | null,
  newLen: number | undefined | null,
  currentUserId?: number | string | null
): MessageWithUser[] => {
  if (!conversation || !Array.isArray(conversation.messages)) return [];
  if (!oldLen || !newLen || newLen <= oldLen) return [];

  const start = oldLen;
  const added = conversation.messages.slice(start, newLen);

  return added.filter(m => !m.isRead && m.senderId !== currentUserId);
};

/**
 * Get the other user in the conversation (not the current user).
 * 
 * @param conversation - The conversation object
 * @param currentUserId - The current user's ID
 * @returns The other user object, or a fallback object with null username
 */
export const getConversationOtherUser = (conversation: ConversationWithMinimalListing, currentUserId: string | number | undefined) => {
  if (!currentUserId || !conversation.sender) return { username: 'Unknown User', id: undefined };
  
  // If current user is the sender, return the receiver
  if (String(conversation.sender.id) === String(currentUserId)) {
    return conversation.receiver || { username: 'Unknown User', id: undefined };
  }
  // Otherwise return the sender
  return conversation.sender || { username: 'Unknown User', id: undefined };
}

/**
 * Get the number of unread messages for the current user in a conversation
 * 
 * @param conversation - The conversation object
 * @param currentUserId - The current user's ID
 * @returns Number of unread messages
 */
export const getUnreadCount = (conversation: ConversationWithMinimalListing, currentUserId: string | number | undefined): number => {
  if (!currentUserId || !conversation.messages) return 0;
  return conversation.messages.filter(
    (message) => !message.isRead && String(message.receiverId) === String(currentUserId)
  ).length;
}

/**
 * Check if the last message in the conversation was sent by the current user
 * 
 * @param conversation - The conversation object
 * @param currentUserId - The current user's ID
 * @returns True if the last message was sent by the current user
 */
export const isLastMessageFromCurrentUser = (conversation: ConversationWithMinimalListing, currentUserId: string | number | undefined): boolean => {
  const lastMessage = getLastMessage(conversation);
  if (!lastMessage || !currentUserId) return false;
  return String(lastMessage.senderId) === String(currentUserId);
}

/**
 * Filter items (enquiries) by role (Sent vs Received/My Enquiries)
 * 
 * @param items - The items to filter
 * @param role - The role to filter by ('Sent', 'My Enquiries', or 'All')
 * @param currentUserId - The current user's ID
 * @returns Filtered array of items
 */
export const filterEnquiriesByRole = <T extends Record<string, any>>(
  items: T[], 
  role: string, 
  currentUserId: string | number | undefined
): T[] => {
  if (!currentUserId || role === 'All') return items;

  return items.filter((item) => {
    const senderId = item.senderId || item.sender?.id;
    const receiverId = item.receiverId || item.receiver?.id;

    if (role === 'Sent') {
      return String(senderId) === String(currentUserId)
    }
    else if (role === 'My Enquiries') {
      return String(receiverId) === String(currentUserId)
    }
    return true
  })
}

/**
 * Handle new message event logic
 * 
 * @param conversations - Current list of conversations
 * @param eventData - The incoming message event data
 * @returns Updated array of conversations
 */
export const handleNewMessageInList = (
  conversations: ConversationWithMinimalListing[], 
  newMessage: MessageWithUser,
  conversationData: ConversationWithMinimalListing | undefined
): ConversationWithMinimalListing[] => {
  // Try to find the conversation
  const index = conversations.findIndex(c => c.id === newMessage.conversationId);
  
  if (index !== -1) {
    const conversation = conversations[index];
    if (!conversation) return conversations;

    // Prevent duplicate messages
    if (conversation.messages.some(m => m.id === newMessage.id)) {
      return conversations;
    }
    
    // Create updated conversation with new message
    const updatedConversation: ConversationWithMinimalListing = {
      ...conversation,
      messages: [...conversation.messages, newMessage],
      updatedAt: new Date()
    };
    
    // Move to top
    const newConversations = [...conversations];
    newConversations.splice(index, 1);
    newConversations.unshift(updatedConversation);
    return newConversations;
  } 
  else if (conversationData) {
    // If conversation is not in the list (e.g. older conversation resurfacing), add it to top
    // Ensure the new message is in the messages list if not already
    const messages = conversationData.messages || [];
    const hasMessage = messages.some((m: any) => m.id === newMessage.id);
    
    const conversationToAdd = {
      ...conversationData,
      messages: hasMessage ? messages : [...messages, newMessage],
      updatedAt: new Date() // Ensure it appears as most recent
    };
    
    return [conversationToAdd, ...conversations];
  }
  
  return conversations;
}

/**
 * Handle message read receipts logic
 * 
 * @param conversations - Current list of conversations
 * @param conversationId - The conversation ID
 * @param messageId - The message ID that was read
 * @returns Updated array of conversations, or null if no change needed
 */
export const handleMessageReadInList = (
  conversations: ConversationWithMinimalListing[], 
  conversationId: number,
  messageId: number
): ConversationWithMinimalListing[] | null => {
  const index = conversations.findIndex(c => c.id === conversationId);
  if (index === -1) return null;

  const conversation = conversations[index];
  if (!conversation) return null;

  const messageIndex = conversation.messages.findIndex((m: MessageWithUser) => m.id === messageId);
  
  if (messageIndex === -1) return null;
  
  const message = conversation.messages[messageIndex];
  if (!message || message.isRead) return null; // Already read or not found, no change
  
  // Clone structures to be immutable
  const newConversations = [...conversations];
  const newMessages = [...conversation.messages];
  
  // Update message
  newMessages[messageIndex] = { ...message, isRead: true };
  
  // Update conversation
  newConversations[index] = {
    ...conversation,
    messages: newMessages
  };
  
  return newConversations;
}

