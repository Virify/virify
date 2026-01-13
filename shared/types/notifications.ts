/**
 * Types related to user notifications
 * Including count badges, push notifications, email notifications, etc.
 */

/**
 * User notification counts for real-time updates and navigation badges
 */
export interface UserItemsAggregates {
  favourites: number;
  notes: number;
  enquiries: number;
  locations: number;
  listings: number; // Count of user's listings
  messages: number; // Total count of all messages in user's conversations
  unreadMessages: number; // Count of unread messages
  unreadConversations: number; // Count of conversations with unread messages
  sentEnquiries: number; // Count of conversations user sent
  sentUnreadEnquiries: number; // Count of sent conversations with unread messages
  receivedEnquiries: number; // Count of conversations user received
  receivedUnreadEnquiries: number; // Count of received conversations with unread messages
}

/**
 * Notification types for future expansion
 */
export interface NotificationBase {
  id: string;
  userId: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Push notification payload
 */
export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, any>;
}

/**
 * Email notification payload
 */
export interface EmailNotificationPayload {
  to: string;
  subject: string;
  template: string;
  data?: Record<string, any>;
}

/**
 * In-app notification types
 */
export type NotificationCategory = keyof UserItemsAggregates;

export interface InAppNotification extends NotificationBase {
  category: NotificationCategory;
  actionUrl?: string;
}
