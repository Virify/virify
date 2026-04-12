/**
 * @fileoverview Pure utility functions for Notification & Aggregate state calculations.
 * 
 * **Purpose:**
 * Extracts the complex counting and optimistic mutation logic out of the main 
 * `useNotifications` composable. This keeps the composable focused on lifecycle/fetching 
 * and makes the mathematical UI updates easily unit-testable.
 * 
 * **State Mutation Logic:**
 * - Calculates precise unread counts depending on the context (all notifications vs. 
 *   specific conversation vs. single notification).
 * - Provides pure functions (`decrementAggregatesForReadMessages`, 
 *   `incrementAggregatesForNewMessage`) to optimistically mutate aggregate state 
 *   objects without side-effects.
 * 
 * **Race Condition Logic:**
 * - Houses `isStaleWsEvent(wsTimestamp, lastFetch)`, the primary mechanism for resolving 
 *   racing between WebSocket pushes and HTTP pulls by evaluating if an incoming real-time 
 *   ping is older than the most recently resolved HTTP source of truth.
 */
/**
 * Centralized aggregate update logic
 * All optimistic updates to badges/counts happen here
 */

import type { UserItemsAggregates } from '~~/shared/types/notifications';

/**
 * Determine unread notification count based on options
 */
export function isStaleWsEvent(wsTimestamp: string | undefined, lastFetch: string | null): boolean {
  if (!wsTimestamp || !lastFetch) return false;
  return new Date(wsTimestamp).getTime() <= new Date(lastFetch).getTime();
}

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
