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
  unreadMessages: number; // Count of unread messages from other users
  // Keep all the original ones even if not used yet
  notifications?: number;
  messages?: number;
  offers?: number;
  viewings?: number;
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
