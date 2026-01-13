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

/**
 * User notifications composable
 * Handles count badges, real-time updates, and future notification features
 */
export function useNotifications() {

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
      // Use useAsyncData with a specific key to deduplicate requests across the app
      // execute: false because we want to trigger it manually here
      const { data, error } = await useAsyncData<UserItemsAggregates>(
        'user-notifications-aggregates',
        () => $fetch<UserItemsAggregates>("/api/notifications/aggregates"),
        {
          immediate: false,
          dedupe: 'defer' 
        }
      );

      // Execute the fetch
      await refreshNuxtData('user-notifications-aggregates');
      
      if (error.value) throw error.value;
      
      if (data.value) {
        aggregates.value = data.value;
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
   */
  async function handleAggregateUpdate(data: AggregateUpdateMessage) {
    // Optimistic update for any aggregate type
    const currentCount = aggregates.value[data.aggregateType] || 0;
    const newCount = data.operation === "add" ? currentCount + 1 : Math.max(0, currentCount - 1);

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
   * Future: Create in-app notification
   */
  async function createInAppNotification(userId: number, title: string, message: string, category: keyof UserItemsAggregates) {
    // TODO: Implement in-app notification functionality
    console.log("In-app notification:", { userId, title, message, category });
  }

  return {
    // Current functionality
    aggregates,
    aggregatesLoading,
    aggregatesError,
    fetchUserItemsAggregates,
    getAggregateCount,
    handleAggregateUpdate,
    
    // Future functionality
    sendPushNotification,
    sendEmailNotification,
    createInAppNotification,
  };
}
