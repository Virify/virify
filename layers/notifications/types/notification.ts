/**
 * User notification type - matches the database model
 */

export interface UserNotification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  senderUsername: string | null;
  senderAvatar: string | null;
  conversationId: number | null;
  listingId: number | null;
  messageId: number | null;
  listingPrice: number | null;
  listingAddress: string | null;
  listingImage: string | null;
  listingIsRental: boolean | null;
  isRead: boolean;
  isDismissed: boolean;
  createdAt: Date;
  readAt: Date | null;
}

/**
 * Notification counts response from /api/notifications/counts
 */
export interface NotificationCounts {
  total: number;
  byType: Record<string, number>;
  newMessages: number;
  newEnquiries: number;
  enquiryReplies: number;
  listingUpdates: number;
  system: number;
}

// Re-export for convenience
export type { NotificationType, InAppNotificationPayload } from '~~/shared/types/notifications';