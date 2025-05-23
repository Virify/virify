import type { Message } from "@prisma/client";
import type { ConversationWithMessages, ConversationWithUserAndMessages } from "~~/shared/types/conversation";

/**
 * Create a conversation
 *
 * @param listingId Listing ID
 * @param senderId Sender ID
 * @param receiverId Receiver ID
 * @param messageContent Message content
 * @returns
 */
export async function createConversation(listingId: number, senderId: number, receiverId: number, messageContent: string): Promise<ConversationWithMessages | Message> {
  return await prisma.conversation.create({
    data: {
      listing: { connect: { id: listingId } },
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
    include: { messages: true },
  });
}

/**
 *
 * @param conversationId conversation ID
 * @param senderId message sender ID
 * @param messageContent string message content
 * @returns the receiver ID to be used in the websocket
 */
export async function replyToConversation(conversationId: number, messageContent: string, senderId: number) {
  return await prisma.$transaction(async (tx) => {
    // First get the conversation for validation and to determine the receiver
    const conversation = await tx.conversation.findUnique({
      where: { id: conversationId },
      select: {
        senderId: true,
        receiverId: true,
      },
    });

    if (!conversation) {
      throw new Error(`Conversation with ID ${conversationId} not found`);
    }

    // Set the receiverId as the opposite of the sender
    const receiverId = senderId === conversation.senderId ? conversation.receiverId : conversation.senderId;

    // Now update the conversation with the new message
    const message = await tx.conversation.update({
      where: { id: conversationId },
      data: {
        messages: {
          create: {
            senderId,
            receiverId,
            content: messageContent,
          },
        },
      },
    });
    return {
      receiverId,
    };
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
      OR: [
        { senderId: userId },
        { receiverId: userId }
      ]
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

  return conversation;
}
