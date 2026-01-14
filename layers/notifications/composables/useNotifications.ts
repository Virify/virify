/**
 * Global state - shared across all composable instances
 */
/**
 * Notification data interface
 */
export interface NotificationData {
  conversationId?: number;
  conversation?: ConversationWithUserAndMessages;
  message?: MessageWithUser;
}

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
const unreadMessages = ref<MessageWithUser[]>([]);
const unreadMessagesLoading = ref(false);
const activeConversationId = ref<number | null>(null);
const lastNotification = ref<{ title: string; description: string; id: number; data?: NotificationData } | null>(null);

/**
 * User notifications composable
 * Handles count badges, real-time updates, and future notification features
 */
export function useNotifications() {
  const { user } = useUserSession();

  async function fetchUnreadMessages() {
    unreadMessagesLoading.value = true;
    try {
      // TODO: Create a cleaner API for this, but for now we filter conversations
      const { conversations } = await $fetch<{ conversations: ConversationWithUserAndMessages[], total: number }>(
        `/api/conversation/?filter=unread&limit=50`
      );
      
      // Extract unread messages from conversations where the current user is the receiver
      const currentUserId = user.value?.id;
      unreadMessages.value = processUnreadMessages(conversations, currentUserId);
      
    } catch (e) {
      console.error("Failed to fetch unread messages", e);
    } finally {
      unreadMessagesLoading.value = false;
    }
  }

  /**
   * Fetch user item aggregates from the API
   * Uses useAsyncData for deduplication and caching
   */
  async function fetchUserItemsAggregates() {
    // Return existing data if loading to prevent duplicate requests
    if (aggregatesLoading.value) return;
    
    aggregatesLoading.value = true;
    aggregatesError.value = null;

    try {
      // Use $fetch directly instead of useAsyncData to avoid context issues when called outside setup
      const data = await $fetch<UserItemsAggregates>("/api/notifications/aggregates");
      
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
   * @param key - The category key
   * @returns The count for the category or undefined
   */
  function getAggregateCount(key?: string): number | undefined {
    if (!key) return undefined;
    return aggregates.value[key as keyof UserItemsAggregates];
  }

  /**
   * Handle real-time aggregate updates via WebSocket
   * Optimistic local updates (+1/-1) for all aggregate types
   * 
   * Drift will reconcile on next fetch or page load/change
   */
  async function handleAggregateUpdate(data: AggregateUpdateMessage) {
    // Calculate new count logic directly to avoid dependency issues
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
   * Future: Send push notification
   */
  async function sendPushNotification(title: string, message: string, data?: any) {
    // TODO: Implement push notification functionality
    console.log("Push notification:", { title, message, data });
  }

  /**
   * Future: Send email notification
   */
  async function sendEmailNotification(to: string, subject: string, template: string, data?: any) {
    // TODO: Implement email notification functionality
    console.log("Email notification:", { to, subject, template, data });
  }

  /**
   * Create an in-app notification
   * Currently just updates global state watched by App.vue
   */
  async function createInAppNotification(userId: number, title: string, message: string, category: keyof UserItemsAggregates, data?: NotificationData) {
    // Update global state which is watched by App.vue
    lastNotification.value = {
      title,
      description: message,
      id: Date.now(),
      data
    };
    console.log("In-app notification queued:", { userId, title, message, category, data });
  }

  /**
   * Remove unread messages for a specific conversation
   * @param conversationId number
   */
  function removeUnreadMessagesForConversation(conversationId: number) {
    const previousLength = unreadMessages.value.length;
    unreadMessages.value = filterMessagesExcludingConversation(unreadMessages.value, conversationId);
    
    // Check how many were removed
    const removedCount = previousLength - unreadMessages.value.length;
    
    // Update local aggregate if we removed specific messages
    if (removedCount > 0 && aggregates.value.unreadMessages !== undefined) {
      aggregates.value.unreadMessages = Math.max(0, aggregates.value.unreadMessages - removedCount);
    } else {
      // If we didn't remove any locally (e.g. list was empty), we must re-sync with server
      // to ensure the aggregate count is correct (as per user request: avoid stuck chips)
      fetchUserItemsAggregates();
    }
  }

  /**
   * Remove a single message from the unread list
   */
  function removeReadMessage(messageId: number) {
    // Find the message to get its conversation ID before removing
    const messageToRemove = unreadMessages.value.find(m => m.id === messageId);
    const conversationId = messageToRemove?.conversationId;

    const previousLength = unreadMessages.value.length;
    unreadMessages.value = unreadMessages.value.filter(msg => msg.id !== messageId);
    
    if (previousLength > unreadMessages.value.length) {
      // Create new aggregates object to trigger reactivity
      const newAggregates = { ...aggregates.value };
      
      // Decrement unread messages count
      if (newAggregates.unreadMessages > 0) {
        newAggregates.unreadMessages--;
      }
      
      // Check if we need to decrement unread conversations count
      // If we removed a message, check if there are any other unread messages left for this conversation
      if (conversationId && newAggregates.unreadConversations > 0) {
        const remainingInConversation = unreadMessages.value.some(m => m.conversationId === conversationId);
        if (!remainingInConversation) {
          newAggregates.unreadConversations--;
        }
      }
      
      aggregates.value = newAggregates;
    } else {
      // If the message wasn't in our local list, fetch server state to be safe
      fetchUserItemsAggregates();
    }
  }

  return {
    // Current functionality
    aggregates,
    aggregatesLoading,
    aggregatesError,
    unreadMessages,
    unreadMessagesLoading,
    fetchUserItemsAggregates,
    fetchUnreadMessages,
    getAggregateCount,
    handleAggregateUpdate,
    activeConversationId,
    lastNotification,
    
    // Future functionality
    sendPushNotification,
    sendEmailNotification,
    createInAppNotification,
    removeUnreadMessagesForConversation,
    removeReadMessage
  };
}
