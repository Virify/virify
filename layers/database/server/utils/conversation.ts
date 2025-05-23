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
 * @param receiverId the receiver ID
 * @returns 
 */
export async function replyToConversation(conversationId: number, senderId: number, receiverId: number, messageContent: string) {
  return await prisma.conversation.update({
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
    include: { messages: true },
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
      messages: true,
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
