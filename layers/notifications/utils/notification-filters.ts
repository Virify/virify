/**
 * Notification filtering and state utilities
 */

import type { UserNotification } from '../types/notification';

/**
 * Count unread notifications by filter type
 */
export function countUnreadNotifications(
  notifications: UserNotification[],
  filterType: 'all' | 'conversation' = 'all',
  conversationId?: number
): number {
  if (filterType === 'conversation' && conversationId) {
    return notifications.filter(n => !n.isRead && n.conversationId === conversationId).length;
  }
  return notifications.filter(n => !n.isRead).length;
}

/**
 * Count unread notifications for a specific notification ID
 */
export function countUnreadNotificationById(
  notifications: UserNotification[],
  notificationId: number
): number {
  const notification = notifications.find(n => n.id === notificationId);
  return notification && !notification.isRead ? 1 : 0;
}

/**
 * Filter notifications that have not been read and have not been dismissed
 */
export function getUnreadNotifications(notifications: UserNotification[]): UserNotification[] {
  return notifications.filter(n => !n.isRead && !n.isDismissed);
}

/**
 * Filter notifications that have not been dismissed
 */
export function getNonDismissedNotifications(notifications: UserNotification[]): UserNotification[] {
  return notifications.filter(n => !n.isDismissed);
}

/**
 * Find notification by ID
 */
export function findNotification(notifications: UserNotification[], notificationId: number): UserNotification | undefined {
  return notifications.find(n => n.id === notificationId);
}

/**
 * Filter notifications for a specific conversation
 */
export function getConversationNotifications(notifications: UserNotification[], conversationId: number): UserNotification[] {
  return notifications.filter(n => n.conversationId === conversationId);
}

/**
 * Check if notification list has duplicates
 */
export function hasDuplicateNotification(notifications: UserNotification[], notificationId: number): boolean {
  return notifications.some(n => n.id === notificationId);
}

/**
 * Mark notifications as read in list (optimistic update)
 */
export function markNotificationsAsReadOptimistic(
  notifications: UserNotification[],
  filterType: 'all' | 'conversation' | 'single' = 'all',
  conversationIdOrNotificationId?: number
): UserNotification[] {
  if (filterType === 'all') {
    return notifications.map(n => ({ ...n, isRead: true }));
  } else if (filterType === 'conversation' && conversationIdOrNotificationId) {
    return notifications.map(n =>
      n.conversationId === conversationIdOrNotificationId ? { ...n, isRead: true } : n
    );
  } else if (filterType === 'single' && conversationIdOrNotificationId) {
    return notifications.map(n =>
      n.id === conversationIdOrNotificationId ? { ...n, isRead: true } : n
    );
  }
  return notifications;
}

/**
 * Remove notification from list (optimistic update)
 */
export function removeNotificationOptimistic(
  notifications: UserNotification[],
  notificationId: number
): UserNotification[] {
  return notifications.filter(n => n.id !== notificationId);
}

/**
 * Merge incoming notifications with existing list (avoid duplicates on pagination)
 */
export function mergeNotifications(
  existing: UserNotification[],
  incoming: UserNotification[]
): UserNotification[] {
  const existingIds = new Set(existing.map(n => n.id));
  const merged = [...existing];
  for (const n of incoming) {
    if (!existingIds.has(n.id)) {
      merged.push(n);
    }
  }
  return merged;
}

/**
 * Validate notification can be processed
 */
export function canProcessNotification(notification: UserNotification | null | undefined): boolean {
  return notification !== null && notification !== undefined;
}

/**
 * Check if should show notification badge
 */
export function shouldShowNotificationBadge(unreadCount: number): boolean {
  return unreadCount > 0;
}
