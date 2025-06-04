import type { Message } from "@prisma/client";
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
export async function createConversation(senderId: number, receiverId: number, messageContent: string, listingId?: number): Promise<ConversationWithUserAndMessages | Message> {
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
