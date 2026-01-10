import { createSharedComposable } from '@vueuse/core';

/**
 * Core conversation state management
 * Handles data fetching, loading states, and basic conversation management
 */
export const useConversationState = createSharedComposable((options?: { limit?: number }) => {
  const { loggedIn, user } = useUserSession();
  const requestFetch = useRequestFetch();

  // Configuration
  const limit = options?.limit || 10;

  // State
  const conversations = ref<ConversationWithUserAndMessages[]>([]);
  const total = ref(0);
  const loading = ref(true);
  const error = ref<string | null>(null);

  // Get current userId safely
  const currentUserId = computed(() => user.value?.id ?? null);

  /**
   * Fetch conversations from the API
   * Returns the conversations ordered by most recent activity
   */
  async function fetchConversations(
    filter: 'all' | 'unread' = 'all', 
    direction: 'all' | 'sent' | 'received' = 'all',
    page: number = 1
  ) {
    if (!loggedIn.value || !currentUserId.value) {
      conversations.value = [];
      total.value = 0;
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const data = await requestFetch<{ conversations: ConversationWithUserAndMessages[], total: number }>(`/api/conversation/?filter=${filter}&direction=${direction}&page=${page}&limit=${limit}`);
      conversations.value = data.conversations || [];
      total.value = data.total || 0;
    } catch (err) {
      console.error('Error fetching conversations:', err);
      error.value = 'Failed to load conversations';
      conversations.value = [];
      total.value = 0;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Get limited conversations based on the configured limit
   */
  const limitedConversations = computed(() => {
    return conversations.value; 
  });

  /**
   * Get recent conversations (configurable limit for different use cases)
   */
  const recentConversations = (customLimit = 10) => {
    return conversations.value.slice(0, customLimit);
  };

  /**
   * Filter conversations by search term
   */
  function filterConversations(conversations: ConversationWithUserAndMessages[], searchTerm: string) {
    if (!searchTerm.trim()) return conversations;
    
    const term = searchTerm.trim().toLowerCase();
    return conversations.filter(c => {
      // Search by sender/receiver name or username, listing title, or last message content
      const senderUsername = c.sender?.username?.toLowerCase() || "";
      const senderEmail = c.sender?.email?.toLowerCase() || "";
      const receiverUsername = c.receiver?.username?.toLowerCase() || "";
      const receiverEmail = c.receiver?.email?.toLowerCase() || "";
      const lastMsg = c.messages?.[c.messages.length-1]?.content?.toLowerCase() || "";
      const address = c.listing?.property?.address?.fullAddress?.toLowerCase() || "";

      return (
        senderUsername.includes(term) ||
        senderEmail.includes(term) ||
        receiverUsername.includes(term) ||
        receiverEmail.includes(term) ||
        lastMsg.includes(term) ||
        address.includes(term)
      );
    });
  }

  /**
   * Auto-fetch conversations when user logs in
   */
  if (import.meta.client) {
    watchEffect(() => {
      if (loggedIn.value && currentUserId.value) {
        fetchConversations();
      } else {
        conversations.value = [];
        error.value = null;
        loading.value = false;
      }
    });
  }

  /**
   * Refresh conversations manually
   */
  function refreshConversations() {
    if (loggedIn.value && currentUserId.value) {
      fetchConversations();
    }
  }

  /**
   * Add a new conversation to the list (for real-time updates)
   */
  function addConversation(conversation: ConversationWithUserAndMessages) {
    conversations.value = addConversationToArray(conversations.value, conversation);
  }

  /**
   * Update a conversation (for real-time message updates)
   */
  function updateConversation(conversationId: number, updatedData: Partial<ConversationWithUserAndMessages>) {
    conversations.value = updateConversationInArray(conversations.value, conversationId, updatedData);
  }

  /**
   * Get the total number of conversations with unread messages for the current user
   * Efficiently cached using computed property since conversations is already reactive
   */
  const unreadConversationsCount = computed(() => {
    if (!currentUserId.value) return 0;
    
    return conversations.value.reduce((count, convo) => {
      // Direct message check slightly more efficient than calling external function repeatedly
      // Check if ANY message in this convo is unread AND sent to me
      const hasUnread = convo.messages?.some(m => !m.isRead && String(m.receiverId) === String(currentUserId.value));
      return count + (hasUnread ? 1 : 0);
    }, 0);
  });

  return {
    conversations: limitedConversations,
    allConversations: conversations,
    recentConversations,
    filterConversations,
    loading: readonly(loading),
    error: readonly(error),
    currentUserId: readonly(currentUserId),
    unreadConversationsCount,
    fetchConversations,
    refreshConversations,
    addConversation,
    updateConversation,
    total: readonly(total),
  };
});
