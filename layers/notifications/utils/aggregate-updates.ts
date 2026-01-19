/**
 * Centralized aggregate update logic
 * All optimistic updates to badges/counts happen here
 */

import type { UserItemsAggregates } from '~~/shared/types/notifications';

/**
 * Determine unread notification count based on options
 */
export function calculateUnreadNotificationCount(
  providedCount: number | undefined,
  options: { all?: boolean; conversationId?: number; notificationId?: number },
  countAll: () => number,
  countByConversation: (id: number) => number,
  countById: (id: number) => number
): number {
  if (providedCount !== undefined && providedCount > 0) {
    return providedCount;
  }

  if (options.all) {
    return countAll();
  } else if (options.conversationId) {
    return countByConversation(options.conversationId);
  } else if (options.notificationId) {
    return countById(options.notificationId);
  }

  return 0;
}

/**
 * Optimistically decrement aggregates when marking messages as read
 * Returns the updated aggregates object
 */
export function decrementAggregatesForReadMessages(
  aggregates: UserItemsAggregates,
  unreadMessageCount: number,
  decrementConversationCount: boolean = true
): UserItemsAggregates {
  if (unreadMessageCount <= 0) {
    return aggregates;
  }

  return {
    ...aggregates,
    unreadMessages: Math.max(0, aggregates.unreadMessages - unreadMessageCount),
    receivedUnreadEnquiries: decrementConversationCount
      ? Math.max(0, aggregates.receivedUnreadEnquiries - 1)
      : aggregates.receivedUnreadEnquiries,
  };
}

/**
 * Optimistically increment aggregates when receiving new messages/enquiries
 */
export function incrementAggregatesForNewMessage(
  aggregates: UserItemsAggregates,
  isNewConversation: boolean = false
): UserItemsAggregates {
  return {
    ...aggregates,
    unreadMessages: aggregates.unreadMessages + 1,
    receivedUnreadEnquiries: isNewConversation
      ? aggregates.receivedUnreadEnquiries + 1
      : aggregates.receivedUnreadEnquiries,
  };
}
