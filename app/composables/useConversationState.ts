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
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Get current userId safely
  const currentUserId = computed(() => user.value?.id ?? null);

  /**
   * Fetch conversations from the API
   * Returns the conversations ordered by most recent activity
   */
  async function fetchConversations() {
    if (!loggedIn.value || !currentUserId.value) {
      conversations.value = [];
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const data = await requestFetch<ConversationWithUserAndMessages[]>('/api/conversation/');
      conversations.value = data || [];
    } catch (err) {
      console.error('Error fetching conversations:', err);
      error.value = 'Failed to load conversations';
      conversations.value = [];
    } finally {
      loading.value = false;
    }
  }

  /**
   * Get limited conversations based on the configured limit
   */
  const limitedConversations = computed(() => {
    return conversations.value.slice(0, limit);
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

  return {
    conversations: limitedConversations,
    allConversations: conversations,
    recentConversations,
    filterConversations,
    loading: readonly(loading),
    error: readonly(error),
    currentUserId: readonly(currentUserId),
    fetchConversations,
    refreshConversations,
    addConversation,
    updateConversation,
  };
});
