
/**
 * Global state - shared across all composable instances
 */
const aggregates = ref<UserItemsAggregates>({
  favourites: 0,
  notes: 0,
  enquiries: 0,
  locations: 0,
  listings: 0,
  unreadMessages: 0,
  messages: 0,
  unreadConversations: 0,
  sentEnquiries: 0,
  sentUnreadEnquiries: 0,
  receivedEnquiries: 0,
  receivedUnreadEnquiries: 0
});
const aggregatesLoading = ref(false);
const aggregatesError = ref<Error | null>(null);

// Notification state
const notifications = ref<UserNotification[]>([]);
const notificationsLoading = ref(false);
const notificationCounts = ref<NotificationCounts | null>(null);
const notificationPage = ref(1);
const notificationHasMore = ref(true);

// Toast notification state
const lastNotification = ref<InAppNotificationPayload | null>(null);
// Dedup guard to prevent repeated toasts for the same notification id
// Useful when multiple tabs are open and each WebSocket peer receives the same notification
const toastedNotificationIds = new Set<number>();

/**
 * User notifications composable
 * Handles count badges, real-time updates, and notification management
 * 
 * Note: Active conversation state is now managed by useEnquiries
 */
export function useNotifications() {
  const { user } = useUserSession();
  const requestFetch = useRequestFetch();

  /**
   * Fetch notifications from the new notifications API
   * Much more efficient than fetching full conversations
   */
  async function fetchNotifications(options?: { includeRead?: boolean; limit?: number; page?: number; append?: boolean }) {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    notificationsLoading.value = true;
    try {
      const { notifications: data, total } = await requestFetch<{ notifications: UserNotification[], total: number }>(
        `/api/notifications/?limit=${limit}&includeRead=${options?.includeRead || false}&page=${page}`
      );

      notifications.value = options?.append ? mergeNotifications(notifications.value, data) : data;

      notificationPage.value = page;
      const loaded = page * limit;
      notificationHasMore.value = loaded < total;
    } catch (e) {
      console.error("Failed to fetch notifications", e);
    } finally {
      notificationsLoading.value = false;
    }
  }

  function resetNotifications() {
    notificationPage.value = 1;
    notificationHasMore.value = true;
    notifications.value = [];
  }

  async function loadMoreNotifications(options?: { includeRead?: boolean; limit?: number }) {
    if (!notificationHasMore.value || notificationsLoading.value) return;
    const nextPage = notificationPage.value + 1;
    await fetchNotifications({
      includeRead: options?.includeRead,
      limit: options?.limit,
      page: nextPage,
      append: true,
    });
  }

  /**
   * Fetch notification counts
   * Used for badge displays - very lightweight query
   */
  async function fetchNotificationCounts() {
    try {
      const data = await requestFetch<NotificationCounts>('/api/notifications/counts');
      notificationCounts.value = data;
    } catch (e) {
      console.error("Failed to fetch notification counts", e);
    }
  }

  /**
   * Fetch user item aggregates from the API
   */
  async function fetchUserItemsAggregates() {
    aggregatesLoading.value = true;
    aggregatesError.value = null;

    try {
      const data = await requestFetch<UserItemsAggregates>("/api/notifications/aggregates");
      if (data) {
        aggregates.value = data;
      }
    } catch (err) {
      console.error("Failed to fetch user items aggregates:", err);
      aggregatesError.value = err as Error;
    } finally {
      aggregatesLoading.value = false;
    }
  }

  /**
   * Get aggregate count for a specific category
   */
  function getAggregateCount(key?: string): number | undefined {
    if (!key) return undefined;
    return aggregates.value[key as keyof UserItemsAggregates];
  }

  /**
   * Handle real-time aggregate updates via WebSocket
   * Optimistic local updates (+1/-1) for all aggregate types
   */
  function handleAggregateUpdate(data: AggregateUpdateMessage) {
    const currentCount = aggregates.value[data.aggregateType] || 0;
    
    let newCount = currentCount;
    if (data.operation === 'add') {
      newCount = currentCount + 1;
    } else if (data.operation === 'remove') {
      newCount = Math.max(0, currentCount - 1);
    }

    aggregates.value = {
      ...aggregates.value,
      [data.aggregateType]: newCount,
    } as UserItemsAggregates;
  }

  /**
   * Add a notification to the local list (for real-time WebSocket updates)
   */
  function addNotification(notification: UserNotification) {
    // Prevent duplicates
    if (!notifications.value.some(n => n.id === notification.id)) {
      notifications.value = [notification, ...notifications.value];
    }
  }

  /**
   * Create an in-app toast notification
   * This triggers the toast UI in App.vue
   */
  function showToast(notification: InAppNotificationPayload) {
    const toastId = notification.id;
    // Skip duplicate toasts for the same notification id
    if (toastId && toastedNotificationIds.has(toastId)) {
      return;
    }

    if (toastId) {
      toastedNotificationIds.add(toastId);
    }

    lastNotification.value = {
      ...notification,
      id: toastId || Date.now(),
    };
  }

  /**
   * Mark notifications as read
   */
  async function markAsRead(options: { notificationId?: number; conversationId?: number; all?: boolean; unreadMessageCount?: number }) {
    try {
      // Use util to calculate unread count
      const unreadNotificationCount = calculateUnreadNotificationCount(
        options.unreadMessageCount,
        options,
        () => countUnreadNotifications(notifications.value, 'all'),
        (id) => countUnreadNotifications(notifications.value, 'conversation', id),
        (id) => countUnreadNotificationById(notifications.value, id)
      );

      // Optimistically update aggregates using util
      if (unreadNotificationCount > 0 && aggregates.value) {
        aggregates.value = decrementAggregatesForReadMessages(aggregates.value, unreadNotificationCount, true);
      }

      await requestFetch('/api/notifications/mark-read', {
        method: 'POST',
        body: options,
      });

      // Optimistically update local notifications state using utility
      let filterType: 'all' | 'conversation' | 'single' = 'all';
      let id: number | undefined;
      if (options.conversationId) {
        filterType = 'conversation';
        id = options.conversationId;
      } else if (options.notificationId) {
        filterType = 'single';
        id = options.notificationId;
      }
      notifications.value = markNotificationsAsReadOptimistic(notifications.value, filterType, id);

      // Refresh aggregates and counts in the background to sync with server
      fetchUserItemsAggregates().catch(e => console.error("Failed to refresh aggregates", e));
      fetchNotificationCounts().catch(e => console.error("Failed to refresh notification counts", e));
    } catch (e) {
      console.error("Failed to mark notifications as read", e);
      // On error, refresh aggregates to get correct state
      fetchUserItemsAggregates().catch(err => console.error("Failed to refresh aggregates after error", err));
    }
  }

  /**
   * Dismiss a notification without marking the underlying enquiry as read
   */
  async function dismissNotification(notificationId: number) {
    try {
      // Optimistically mark as dismissed locally
      notifications.value = notifications.value.map(n =>
        n.id === notificationId ? { ...n, isDismissed: true } : n
      );

      await requestFetch('/api/notifications/dismiss', {
        method: 'POST',
        body: { notificationId },
      });
    } catch (e) {
      console.error('Failed to dismiss notification', e);
      // Revert on error
      notifications.value = notifications.value.map(n =>
        n.id === notificationId ? { ...n, isDismissed: false } : n
      );
    }
  }

  /**
   * Get unread notification count
   */
  const unreadCount = computed(() => {
    return countUnreadNotifications(notifications.value, 'all');
  });

  /**
   * Get unread notifications only
   */
  const unreadNotifications = computed(() => {
    return getUnreadNotifications(notifications.value);
  });

  return {
    // Aggregates
    aggregates,
    aggregatesLoading,
    aggregatesError,
    fetchUserItemsAggregates,
    getAggregateCount,
    handleAggregateUpdate,
    
    // Notifications
    notifications,
    notificationsLoading,
    notificationCounts,
    notificationPage,
    notificationHasMore,
    fetchNotifications,
    loadMoreNotifications,
    resetNotifications,
    fetchNotificationCounts,
    addNotification,
    markAsRead,
    dismissNotification,
    unreadCount,
    unreadNotifications,
    
    // Toast notifications
    lastNotification,
    showToast,
  };
}
