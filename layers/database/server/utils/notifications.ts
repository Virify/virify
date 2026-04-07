/**
 * Get user item counts for notification purposes
 * These are the counts displayed in navigation badges
 *
 * @param userId - The ID of the user for whom to get item counts
 * @returns UserItemsAggregates - An object containing notification counts
 */
export async function getUserItemsAggregates(userId: number): Promise<UserItemsAggregates> {
  const [
      favourites, 
      notes, 
      hiddenListings,
      enquiries, 
      locations, 
      listings,
      draftListings,
      archivedListings,
      messages, 
      unreadMessages, 
      unreadConversations, 
      sentEnquiries, 
      sentUnreadEnquiries, 
      receivedEnquiries, 
      receivedUnreadEnquiries
    ] = await prisma.$transaction([
    prisma.userFavouriteListing.count({
      where: {
        userPreferences: {
          userId: userId,
        },
      },
    }),
    prisma.userNote.count({
      where: {
        userPreferences: {
          userId: userId,
        },
      },
    }),
    prisma.hiddenListing.count({
      where: {
        userPreferences: {
          userId: userId,
        },
      },
    }),
    // Count ALL conversations where user is either sender or receiver
    prisma.conversation.count({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
    }),
    prisma.userLocation.count({
      where: {
        userPreferences: {
          userId: userId,
        },
      },
    }),
    // Count active (non-archived) listings
    prisma.listing.count({
      where: {
        userId: userId,
        archived: false,
      },
    }),
    // Count draft listings
    prisma.draftListing.count({
      where: {
        userId: userId,
      },
    }),
    // Count archived listings
    prisma.listing.count({
      where: {
        userId: userId,
        archived: true,
      },
    }),
    // Count ALL messages in conversations where user is a participant
    prisma.message.count({
      where: {
        conversation: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
      },
    }),
    // Count ALL unread messages received by the user
    prisma.message.count({
      where: {
        isRead: false,
        receiverId: userId,
      },
    }),
    // Count conversations with unread messages
    prisma.conversation.count({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
        messages: {
          some: {
            isRead: false,
            receiverId: userId,
          },
        },
      },
    }),
    // Count SENT conversations
    prisma.conversation.count({
      where: {
        senderId: userId,
      },
    }),
    // Count SENT conversations with unread messages
    prisma.conversation.count({
      where: {
        senderId: userId,
        messages: {
          some: {
            isRead: false,
            receiverId: userId,
          },
        },
      },
    }),
    // Count RECEIVED conversations
    prisma.conversation.count({
      where: {
        receiverId: userId,
      },
    }),
    // Count RECEIVED conversations with unread messages
    prisma.conversation.count({
      where: {
        receiverId: userId,
        messages: {
          some: {
            isRead: false,
            receiverId: userId,
          },
        },
      },
    }),
  ]);

  return {
    favourites,
    notes,
    hiddenListings,
    enquiries,
    locations,
    listings,
    draftListings,
    archivedListings,
    messages,
    unreadMessages,
    unreadConversations,
    sentEnquiries,
    sentUnreadEnquiries,
    receivedEnquiries,
    receivedUnreadEnquiries,
  };
}
