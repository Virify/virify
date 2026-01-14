import type { MessageWithUser } from "~~/shared/types/conversation";


/**
 * Create a conversation
 *
 * @param listingId Listing ID
 * @param senderId Sender ID
 * @param receiverId Receiver ID
 * @param messageContent Message content
 * @returns
 */
export async function createConversation(senderId: number, receiverId: number, messageContent: string, listingId?: number): Promise<ConversationWithMinimalListing> {
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
          conversationId: true,
          sender: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          receiver: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      },
      sender: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      receiver: {
        select: {
          id: true,
          username: true,
          avatar: true,
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
        ...conversationWithListingCard,
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
        conversationId: true,
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
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return newMessage;
  });
}

/**
 * Get a conversation by ID with all details
 *
 * @param conversationId Conversation ID
 * @returns Conversation object or null
 */
export async function getConversation(conversationId: number): Promise<ConversationWithMinimalListing | null> {
  return await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: conversationWithListingCard,
  });
}

/**
 *
 * @param userId User ID
 * @param conversationId conversation ID
 * @param skip number of records to skip
 * @param take number of records to take
 * @param sort "asc" | "desc"
 * @returns
 */
export async function getConversationsByUserId(
  userId: number, 
  options?: { 
    skip?: number; 
    take?: number; 
    sort?: "asc" | "desc";
    sortBy?: "date" | "listing";
    filter?: "all" | "unread";
    direction?: "all" | "sent" | "received";
    listingId?: number;
  }
): Promise<{ conversations: ConversationWithMinimalListing[], total: number }> {
  const { skip, take, sort = "desc", sortBy = "date", filter = "all", direction = "all", listingId } = options || {};
  
  const whereClause: any = {};

  // Add direction filter
  if (direction === "sent") {
    whereClause.senderId = userId;
  } else if (direction === "received") {
    whereClause.receiverId = userId;
  } else {
    // Default: show all conversations where user is participant
    whereClause.OR = [{ senderId: userId }, { receiverId: userId }];
  }

  // Add unread filter if requested
  if (filter === "unread") {
    whereClause.messages = {
      some: {
        isRead: false,
        receiverId: userId,
      },
    };
  }

  if (listingId) {
    whereClause.listingId = listingId;
  }

  if (sortBy === 'listing') {
    // Unique listing pagination logic
    // 1. Get paginated unique listing IDs sorted by most recent activity
    const [distinctListings, totalListings] = await Promise.all([
      prisma.conversation.findMany({
        where: whereClause,
        orderBy: [
          { updatedAt: sort },
          { id: 'desc' }
        ],
        distinct: ['listingId'],
        skip,
        take,
        select: { listingId: true },
      }),
      // Count distinct listings (approximated by grouping)
      prisma.conversation.groupBy({
        by: ['listingId'],
        where: whereClause,
      }).then(res => res.length)
    ]);

    const listingIds = distinctListings.map(c => c.listingId).filter(id => id !== null) as number[];
    const includeGeneral = distinctListings.some(c => c.listingId === null);
    
    // If no distinct listings found for this page, return empty result
    // This prevents an empty OR clause which could return unexpected results
    if (listingIds.length === 0 && !includeGeneral) {
      return { conversations: [], total: totalListings };
    }
    
    // 2. Fetch all conversations for these listings defined by original filters
    // ensuring we include 'null' listingId (general enquiries) if they appeared in the distinct list
    
    const conversations = await prisma.conversation.findMany({
      where: {
        ...whereClause,
        AND: [
          {
            OR: [
              ...(listingIds.length > 0 ? [{ listingId: { in: listingIds } }] : []),
              ...(includeGeneral ? [{ listingId: null }] : [])
            ]
          }
        ]
      },
      select: {
        ...conversationWithListingCard,
      },
      orderBy: {
        updatedAt: sort, // Sort conversations within the listing groups by date too
      }
    });

    return { conversations, total: totalListings };

  } else {
    // Standard conversation pagination
    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where: whereClause,
        select: {
          ...conversationWithListingCard,
        },
        skip,
        take,
        orderBy: {
          updatedAt: sort,
        },
      }),
      prisma.conversation.count({
        where: whereClause,
      }),
    ]);

    return { conversations, total };
  }
}

/**
 * Get a conversation by ID, ensuring the user is a participant
 *
 * @param conversationId The ID of the conversation to fetch
 * @param userId The ID of the user requesting the conversation
 * @returns The conversation if the user is a participant, otherwise null
 */
export async function getConversationById(conversationId: number, userId: number): Promise<ConversationWithMinimalListing | null> {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    select: {
      ...conversationWithListingCard,
    },
  });

  return conversation;
}

/**
 * Get listing IDs that a user has started conversations for
 *
 * @param userId User ID
 * @returns Array of listing IDs the user has contacted about
 */
export async function getSentConversationListingIds(userId: number): Promise<number[]> {
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
        conversationId: true,
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            avatar: true,
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
      conversationId: true,
      sender: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      receiver: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
  });
}


export async function findConversationForUser(conversationId: number, userId: number): Promise<ConversationWithMinimalListing | null> {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [
        { senderId: userId },
        { receiverId: userId }
      ]
    },
    select: conversationWithListingCard
  });
  
  return conversation as ConversationWithMinimalListing | null;
}

/**
 * Determine the receiver ID based on the sender and the conversation 
 */
export function getConversationReceiverId(senderId: number, conversation: { sender: { id: number }, receiver: { id: number } }): number {
  return senderId === conversation.sender.id ? conversation.receiver.id : conversation.sender.id;
}

/**
 * Get the ID of the other participant involved in a message or conversation
 */
export function getOtherParticipantId(currentUserId: number, context: { senderId: number, receiverId: number }): number {
  return context.senderId === currentUserId ? context.receiverId : context.senderId;
}

/**
 * Base conversation select without listing
 * Used as the foundation for all conversation queries
 */
const conversationBaseSelect = {
  id: true,
  listingId: true,
  createdAt: true,
  updatedAt: true,
  messages: {
    orderBy: {
      createdAt: 'asc' as const
    },
    select: {
      id: true,
      senderId: true,
      receiverId: true,
      isRead: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      conversationId: true,
      sender: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      receiver: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
  },
  sender: {
    select: {
      id: true,
      username: true,
      avatar: true,
    },
  },
  receiver: {
    select: {
      id: true,
      username: true,
      avatar: true,
    },
  },
};

/**
 * Minimal listing fields for conversation lists
 * Contains only essential data for display in conversation list items
 */
const conversationListingMinimalSelect = {
  id: true,
  price: true,
  rentalListing: { select: { id: true } },
  saleListing: { select: { id: true } },
  property: {
    select: {
      media: {
        select: {
          image: true,
        },
        take: 1,
      },
      address: {
        select: {
          fullAddress: true,
          city: true,
          postcode: true,
        },
      },
      type: {
        select: {
          name: true,
        },
      },
      numberBedrooms: true,
      numberBathrooms: true,
      numberReceptions: true,
      numberOtherRooms: true,
    },
  },
};

/**
 * Conversation card listing fields
 * Contains more data for rendering the listing card in conversation lists
 */
const conversationListingCardSelect = {
  id: true,
  price: true,
  rentalListing: { select: { id: true } },
  saleListing: { select: { id: true } },
  property: {
    select: {
      media: {
        select: {
          image: true,
          metadata: true,
        },
      },
      address: {
        select: {
          fullAddress: true,
          street: true,
          city: true,
          postcode: true,
        },
      },
      type: {
        select: {
          name: true,
        },
      },
      numberBedrooms: true,
      numberBathrooms: true,
      numberReceptions: true,
      numberOtherRooms: true,
    },
  },
};

/**
 * Conversation select with minimal listing data
 * Used for conversation lists where multiple conversations are displayed
 */
export const conversationWithMinimalListing = {
  ...conversationBaseSelect,
  listing: {
    select: conversationListingMinimalSelect
  }
};

/**
 * Conversation select with card listing data
 * Used for enquiry lists where listing cards need to be rendered
 */
export const conversationWithListingCard = {
  ...conversationBaseSelect,
  listing: {
    select: conversationListingCardSelect
  }
};


