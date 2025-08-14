import type { ConversationWithUserAndMessages, MessageWithUser } from "~~/shared/types/conversation";

/**
 * Create a conversation
 *
 * @param listingId Listing ID
 * @param senderId Sender ID
 * @param receiverId Receiver ID
 * @param messageContent Message content
 * @returns
 */
export async function createConversation(senderId: number, receiverId: number, messageContent: string, listingId?: number): Promise<ConversationWithUserAndMessages> {
  return await prisma.conversation.create({
    data: {
      ...(listingId ? { listing: { connect: { id: listingId } } } : {}),
      sender: { connect: { id: senderId } },
      receiver: { connect: { id: receiverId } },
      messages: {
        create: {
          senderId,
          receiverId,
          content: messageContent,
        },
      },
    },
    select: {
      id: true,
      listingId: true,
      createdAt: true,
      updatedAt: true,
      messages: {
        select: {
          id: true,
          senderId: true,
          receiverId: true,
          content: true,
          isRead: true,
          createdAt: true,
          updatedAt: true,
          sender: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          receiver: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      },
      sender: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      receiver: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });
}

/**
 *
 * @param conversationId conversation ID
 * @param senderId message sender ID
 * @param messageContent string message content
 * @returns The message created in the conversation
 */
export async function replyToConversation(conversationId: number, messageContent: string, senderId: number): Promise<MessageWithUser> {
  return await prisma.$transaction(async (tx) => {
    // First get the conversation for validation and to determine the receiver
    const conversation = await tx.conversation.findUnique({
      where: { id: conversationId },
      select: {
        ...conversationWithUserAndMessages,
      },
    });

    if (!conversation) {
      throw new Error(`Conversation with ID ${conversationId} not found`);
    }

    // Set the receiverId as the opposite of the sender
    const receiverId = senderId === conversation.sender.id ? conversation.receiver.id : conversation.sender.id;

    // Create the message directly
    const newMessage = await tx.message.create({
      data: {
        senderId,
        receiverId,
        content: messageContent,
        conversationId,
      },
      select: {
        id: true,
        senderId: true,
        receiverId: true,
        content: true,
        isRead: true,
        createdAt: true,
        updatedAt: true,
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return newMessage;
  });
}

/**
 *
 * @param userId User ID
 * @param conversationId conversation ID
 * @returns
 */
export async function getConversationsByUserId(userId: number): Promise<ConversationWithUserAndMessages[]> {
  return await prisma.conversation.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    select: {
      ...conversationWithUserAndMessages,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

/**
 * Get a conversation by ID, ensuring the user is a participant
 *
 * @param conversationId The ID of the conversation to fetch
 * @param userId The ID of the user requesting the conversation
 * @returns The conversation if the user is a participant, otherwise null
 */
export async function getConversationById(conversationId: number, userId: number): Promise<ConversationWithUserAndMessages | null> {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    select: {
      ...conversationWithUserAndMessages,
    },
  });

  return conversation;
}

/**
 * Get listing IDs that a user has sent enquiries for
 *
 * @param userId User ID
 * @returns Array of listing IDs the user has enquired about
 */
export async function getSentEnquiryListingIds(userId: number): Promise<number[]> {
  const sentListingIds = await prisma.conversation.findMany({
    where: {
      sender: { id: userId },
      listingId: { not: null }
    },
    select: {
      listingId: true
    },
    distinct: ['listingId']
  });

  return sentListingIds
    .map(conv => conv.listingId)
    .filter(Boolean) as number[];
}

/**
 * Mark a message as read
 *
 * @param messageId The ID of the message to mark as read
 * @param userId The ID of the user marking the message as read (must be the receiver)
 * @returns The updated message if successful, null if not authorized or message not found
 */
export async function markMessageAsRead(messageId: number, userId: number): Promise<MessageWithUser | null> {
  // First verify the user is the receiver of this message
  const message = await prisma.message.findUnique({
    where: { id: messageId },
    select: {
      id: true,
      receiverId: true,
      isRead: true,
    },
  });

  if (!message || message.receiverId !== userId) {
    return null; // User is not authorized to mark this message as read
  }

  if (message.isRead) {
    // Message is already read, return current state
    return await prisma.message.findUnique({
      where: { id: messageId },
      select: {
        id: true,
        senderId: true,
        receiverId: true,
        content: true,
        isRead: true,
        createdAt: true,
        updatedAt: true,
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }

  // Mark the message as read
  return await prisma.message.update({
    where: { id: messageId },
    data: { isRead: true },
    select: {
      id: true,
      senderId: true,
      receiverId: true,
      content: true,
      isRead: true,
      createdAt: true,
      updatedAt: true,
      sender: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      receiver: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });
}

export const conversationWithUserAndMessages = {
  id: true,
  listingId: true,
  createdAt: true,
  updatedAt: true,
  messages: {
    select: {
      id: true,
      senderId: true,
      receiverId: true,
      isRead: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      sender: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      receiver: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  },
  sender: {
    select: {
      id: true,
      username: true,
      email: true,
    },
  },
  receiver: {
    select: {
      id: true,
      username: true,
      email: true,
    },
  },
  listing: {
    select: {
      ...listingCardFields,
    }
  }
};
