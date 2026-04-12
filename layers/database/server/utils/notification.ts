import { prisma } from "./prisma-client";

/**
 * Data needed to create a notification
 */
export interface CreateNotificationData {
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead?: boolean;
  readAt?: Date | null;
  senderUsername?: string | null;
  senderAvatar?: string | null;
  conversationId?: number | null;
  listingId?: number | null;
  messageId?: number | null;
  // Minimal listing data for display
  listingPrice?: number | null;
  listingAddress?: string | null;
  listingImage?: string | null;
  listingIsRental?: boolean | null;
}

/**
 * Create a new user notification
 * This should be called when a new message or conversation is created
 */
export async function createNotification(data: CreateNotificationData) {
  const notification = await prisma.userNotification.create({
    data: {
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      isRead: data.isRead ?? false,
      readAt: data.readAt ?? null,
      senderUsername: data.senderUsername,
      senderAvatar: data.senderAvatar,
      conversationId: data.conversationId,
      listingId: data.listingId,
      messageId: data.messageId,
      listingPrice: data.listingPrice,
      listingAddress: data.listingAddress,
      listingImage: data.listingImage,
      listingIsRental: data.listingIsRental,
    },
  });

  // Bust the counts cache for this user so the next GET /api/notifications/counts
  // returns fresh data and badges update immediately.
  const storage = useStorage('cache');
  storage.removeItem(`notif-counts:user:${data.userId}`).catch(() => {});

  return notification;
}

/**
 * Create a notification for a new message
 * Extracts the minimal data needed from the message context
 */
export async function createMessageNotification(
  receiverId: number,
  messageContent: string,
  senderUsername: string | null,
  senderAvatar: string | null,
  conversationId: number,
  messageId: number,
  listing?: {
    id: number;
    price: number | null;
    address: string | null;
    image: string | null;
    isRental: boolean;
  } | null
) {
  const truncatedMessage = messageContent.length > 200 
    ? messageContent.slice(0, 200) + '...' 
    : messageContent;

  // Dedupe: if a notification already exists for this user/message, return it
  const existing = await prisma.userNotification.findFirst({
    where: { userId: receiverId, messageId },
  });
  if (existing) return existing;

  return await createNotification({
    userId: receiverId,
    type: 'NEW_MESSAGE',
    title: `New message from ${senderUsername || 'Someone'}`,
    message: truncatedMessage,
    senderUsername,
    senderAvatar,
    conversationId,
    messageId,
    listingId: listing?.id,
    listingPrice: listing?.price,
    listingAddress: listing?.address,
    listingImage: listing?.image,
    listingIsRental: listing?.isRental,
  });
}

/**
 * Create a notification for a new enquiry (new conversation)
 */
export async function createEnquiryNotification(
  receiverId: number,
  messageContent: string,
  senderUsername: string | null,
  senderAvatar: string | null,
  conversationId: number,
  messageId: number,
  listing?: {
    id: number;
    price: number | null;
    address: string | null;
    image: string | null;
    isRental: boolean;
  } | null
) {
  const truncatedMessage = messageContent.length > 200 
    ? messageContent.slice(0, 200) + '...' 
    : messageContent;

  // Dedupe: if a notification already exists for this user/message, return it
  const existing = await prisma.userNotification.findFirst({
    where: { userId: receiverId, messageId },
  });
  if (existing) return existing;

  return await createNotification({
    userId: receiverId,
    type: 'NEW_ENQUIRY',
    title: `New enquiry from ${senderUsername || 'Someone'}`,
    message: truncatedMessage,
    senderUsername,
    senderAvatar,
    conversationId,
    messageId,
    listingId: listing?.id,
    listingPrice: listing?.price,
    listingAddress: listing?.address,
    listingImage: listing?.image,
    listingIsRental: listing?.isRental,
  });
}

/**
 * Get unread notifications for a user
 * This is the primary method for fetching notifications - much lighter than fetching conversations
 */
export async function getUnreadNotifications(userId: number, limit: number = 50) {
  return await prisma.userNotification.findMany({
    where: {
      userId,
      isRead: false,
      isDismissed: false,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });
}

/**
 * Get all notifications for a user with pagination
 */
export async function getNotifications(
  userId: number, 
  options?: { 
    skip?: number; 
    take?: number; 
    includeRead?: boolean;
    includeDismissed?: boolean;
  }
) {
  const { skip = 0, take = 20, includeRead = false, includeDismissed = false } = options || {};

  const where: any = { userId };
  
  if (!includeRead) {
    where.isRead = false;
  }
  
  if (!includeDismissed) {
    where.isDismissed = false;
  }

  const [notifications, total] = await Promise.all([
    prisma.userNotification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.userNotification.count({ where }),
  ]);

  return { notifications, total };
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(notificationId: number, userId: number) {
  return await prisma.userNotification.updateMany({
    where: {
      id: notificationId,
      userId, // Ensure the user owns this notification
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
}

/**
 * Mark all notifications for a conversation as read
 * Called when a user opens a conversation
 */
export async function markConversationNotificationsAsRead(conversationId: number, userId: number) {
  return await prisma.userNotification.updateMany({
    where: {
      conversationId,
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: number) {
  return await prisma.userNotification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
}

/**
 * Dismiss a notification (hide it from the list)
 */
export async function dismissNotification(notificationId: number, userId: number) {
  return await prisma.userNotification.updateMany({
    where: {
      id: notificationId,
      userId,
    },
    data: {
      isDismissed: true,
    },
  });
}

/**
 * Get notification counts for a user
 * Used for badge displays and aggregates
 */
export async function getNotificationCounts(userId: number) {
  const [unreadCount, unreadByType] = await Promise.all([
    prisma.userNotification.count({
      where: {
        userId,
        isRead: false,
        isDismissed: false,
      },
    }),
    prisma.userNotification.groupBy({
      by: ['type'],
      where: {
        userId,
        isRead: false,
        isDismissed: false,
      },
      _count: true,
    }),
  ]);

  // Convert groupBy result to a type-keyed object
  const countsByType: Record<string, number> = {};
  for (const item of unreadByType) {
    countsByType[item.type] = item._count;
  }

  return {
    total: unreadCount,
    byType: countsByType,
    newMessages: countsByType['NEW_MESSAGE'] || 0,
    newEnquiries: countsByType['NEW_ENQUIRY'] || 0,
    enquiryReplies: countsByType['ENQUIRY_REPLY'] || 0,
    listingUpdates: countsByType['LISTING_UPDATE'] || 0,
    system: countsByType['SYSTEM'] || 0,
  };
}

/**
 * Delete old read notifications (cleanup job)
 * Keeps the notification table from growing unbounded
 */
export async function cleanupOldNotifications(daysOld: number = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  return await prisma.userNotification.deleteMany({
    where: {
      isRead: true,
      createdAt: {
        lt: cutoffDate,
      },
    },
  });
}
