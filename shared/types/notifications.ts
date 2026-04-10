/**
 * Types related to user notifications
 * Including count badges, push notifications, email notifications, etc.
 */

/**
 * Notification types - matches the database model
 */
export type NotificationType = "NEW_MESSAGE" | "NEW_ENQUIRY" | "ENQUIRY_REPLY" | "LISTING_UPDATE" | "SYSTEM" | "VIEWING_REQUEST" | "VIEWING_ACCEPTED" | "VIEWING_REJECTED" | "VIEWING_RESCHEDULED" | "VIEWING_CANCELLED";

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

/**
 * User notification counts for real-time updates and navigation badges
 */
export interface UserItemsAggregates {
  favourites: number;
  notes: number;
  hiddenListings: number;
  viewedListings: number;
  enquiries: number;
  locations: number;
  listings: number; // Count of user's active (non-archived) listings
  draftListings: number; // Count of user's draft listings
  archivedListings: number; // Count of user's archived listings
  messages: number; // Total count of all messages in user's conversations
  unreadMessages: number; // Count of unread messages
  unreadConversations: number; // Count of conversations with unread messages
  sentEnquiries: number; // Count of conversations user sent
  sentUnreadEnquiries: number; // Count of sent conversations with unread messages
  receivedEnquiries: number; // Count of conversations user received
  receivedUnreadEnquiries: number; // Count of received conversations with unread messages
  viewings: number; // Count of user's active viewings (PENDING + ACCEPTED + RESCHEDULED)
}

/**
 * Minimal data for displaying an in-app toast notification
 * Used when a WebSocket event arrives
 */
export interface InAppNotificationPayload {
  id: number;
  title: string;
  description: string;
  type?: NotificationType;
  conversationId?: number;
  listingId?: number;
  senderUsername?: string;
  senderAvatar?: string;
}

/**
 * Notification types for future expansion
 */
// Reserved for future use when implementing push notifications, email notifications, etc.

export type NotificationCategory = keyof UserItemsAggregates;
