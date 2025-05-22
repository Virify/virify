/**
 * Create or update a conversation
 * 
 * @param listingId Listing ID
 * @param senderId Sender ID
 * @param receiverId Sender ID
 * @param messageContent Message content
 * @returns 
 */
export async function createOrUpdateConversation(
  listingId: number,
  senderId: number,
  receiverId: number,
  messageContent: string
) {
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.conversation.findFirst({
      where: {
        listingId,
        senderId,
        receiverId,
      },
      include: { messages: true },
    });

    if (existing) {
      // Append new message
      return await tx.message.create({
        data: {
          conversationId: existing.id,
          senderId,
          receiverId,
          content: messageContent,
        },
        include: { conversation: true },
      });
    } else {
      // Create conversation + first message
      return await tx.conversation.create({
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
  });
}