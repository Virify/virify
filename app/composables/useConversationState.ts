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
    loading: readonly(loading),
    error: readonly(error),
    currentUserId: readonly(currentUserId),
    fetchConversations,
    refreshConversations,
    addConversation,
    updateConversation,
  };
});
