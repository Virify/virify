

/**
 * Core conversation state management
 * Handles data fetching, loading states, and basic conversation management
 */
export const useConversationState = (options?: { limit?: number }) => {
  const { loggedIn, user } = useUserSession();
  const requestFetch = useRequestFetch();

  // Configuration
  const defaultLimit = options?.limit || 10;

  // State
  const conversations = useState<ConversationWithUserAndMessages[]>('conversations', () => []);
  const total = useState<number>('conversations-total', () => 0);
  const loading = useState<boolean>('conversations-loading', () => true);
  const error = useState<string | null>('conversations-error', () => null);

  // Get current userId safely
  const currentUserId = computed(() => user.value?.id ?? null);

  /**
   * Fetch conversations from the API
   * Returns the conversations ordered by most recent activity
   */
  async function fetchConversations(
    filter: 'all' | 'unread' = 'all', 
    direction: 'all' | 'sent' | 'received' = 'all',
    page: number = 1,
    sort: 'newest' | 'oldest' | 'listing' = 'newest',
    limit: number = defaultLimit,
    listingId?: number
  ) {
    if (!loggedIn.value || !currentUserId.value) {
      conversations.value = [];
      total.value = 0;
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      let url = `/api/conversation/?filter=${filter}&direction=${direction}&sort=${sort}&page=${page}&limit=${limit}`;
      if (listingId) {
        url += `&listingId=${listingId}`;
      }
      const data = await requestFetch<{ conversations: ConversationWithUserAndMessages[], total: number }>(url);
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
    return filterConversationsByTerm(conversations, searchTerm);
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
      // Use utility to check for unread messages
      const hasUnread = getUnreadCount(convo, currentUserId.value!) > 0;
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
};
