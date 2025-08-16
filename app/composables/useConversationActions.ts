/**
 * Conversation actions like sending messages, marking as read, starting new conversations, etc.
 * Handles user interactions with conversations
 */
export function useConversationActions(conversationState: ReturnType<typeof useConversationState>) {
  const { currentUserId, allConversations } = conversationState;
  const { loggedIn, user } = useUserSession();
  const requestFetch = useRequestFetch();
  const { showDialog } = useDialog();

  // State for new conversation functionality
  const sentConversations = ref<number[]>([]); // Listing IDs already contacted
  const loadingConversations = ref(false);

  /**
   * Send a reply message in a conversation
   */
  async function sendReply(conversationId: number, content: string) {
    if (!content.trim() || !currentUserId.value) {
      throw new Error("Message content is required");
    }

    try {
      const newMessage = await $fetch<MessageWithUser>("/api/conversation/reply/", {
        method: "POST",
        body: { message: content, conversationId },
      });

      // Don't add the message here - let WebSocket events handle it
      // This prevents duplicates when WebSocket also adds the same message

      return newMessage;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  /**
   * Mark a conversation as read - TODO: Implement when backend support is added
   */
  async function markAsRead(conversationId: number) {
    // TODO: Implement when backend read status API is available
    console.log("Mark as read requested for conversation:", conversationId);
  }

  /**
   * Get unread message count for a conversation - TODO: Implement when backend support is added
   */
  function getUnreadCount(conversationId: number): number {
    // TODO: Implement when backend read status support is added
    return 0;
  }

  /**
   * Get total unread conversations count
   */
  const unreadConversationsCount = computed(() => {
    // TODO: Implement when backend read status support is added
    return 0;
  });

  /**
   * Hydrate sentConversations from backend - optimized to fetch only listing IDs
   */
  async function hydrateConversations() {
    if (!loggedIn.value || !currentUserId.value) {
      sentConversations.value = [];
      return;
    }
    loadingConversations.value = true;
    try {
      const listingIds = await requestFetch<number[]>('/api/conversation/sent');
      sentConversations.value = listingIds;
    } catch (error) {
      console.error('Error hydrating conversations:', error);
    } finally {
      loadingConversations.value = false;
    }
  }

  // Auto-hydrate on login state change (client only)
  if (process.client) {
    watchEffect(() => {
      if (loggedIn.value) {
        hydrateConversations();
      } else {
        sentConversations.value = [];
      }
    });
  }

  /**
   * Check if a conversation has already been started for a listing
   */
  function hasConversation(listingId: number): boolean {
    return sentConversations.value.includes(listingId);
  }

  /**
   * Start a conversation about a listing
   */
  async function startConversation(listingId: number, receiverId: number, message: string) {
    if (!currentUserId.value || receiverId === currentUserId.value) {
      // Don't allow sending to self or without a valid user
      return;
    }
    if (hasConversation(listingId)) {
      return;
    }
    try {
      await requestFetch('/api/conversation/create', {
        method: 'POST',
        body: { listingId, receiverId, message },
      });
      sentConversations.value.push(listingId);
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  }

  /**
   * Check if user can start a conversation about a listing
   */
  function canStartConversation(listingId: number, receiverId?: number | null): boolean {
    if (!receiverId || typeof receiverId !== 'number' || isNaN(receiverId)) return false;
    if (receiverId === currentUserId.value) return false; // Can't contact about own property
    if (hasConversation(listingId)) return false;
    return true;
  }

  /**
   * Get conversation button state for UI
   */
  function getConversationState(listingId: number, receiverId?: number | null) {
    const safeReceiverId = typeof receiverId === 'number' && !isNaN(receiverId) ? receiverId : null;
    const isSelf = safeReceiverId !== null && currentUserId.value === safeReceiverId;
    const alreadyStarted = hasConversation(listingId);
    
    return {
      isDisabled: !safeReceiverId || alreadyStarted || loadingConversations.value || isSelf,
      label: isSelf ? 'Self Listing' : alreadyStarted ? 'Message sent' : 'Contact now',
      canStartConversation: canStartConversation(listingId, receiverId)
    };
  }

  /**
   * Handle conversation button click - opens appropriate dialog
   */
  async function handleConversationClick(listingId: number, receiverId?: number | null) {
    // Lazy import to avoid circular dependencies
    const [{ default: ViewsDialogLogin }, { default: ViewsDialogConversation }] = await Promise.all([
      import('~/components/views/Dialog/ViewsDialogLogin.vue'),
      import('~/components/views/Dialog/ViewsDialogConversation.vue')
    ]);

    if (!user.value || !user.value.id) {
      showDialog({
        component: ViewsDialogLogin,
      });
      return;
    }

    if (canStartConversation(listingId, receiverId)) {
      showDialog({
        component: ViewsDialogConversation,
        props: { listingId, receiverId },
      });
    }
  }

  return {
    sendReply,
    markAsRead,
    getUnreadCount,
    unreadConversationsCount,
    // New conversation functionality
    hasConversation,
    startConversation,
    sentConversations,
    loadingConversations,
    hydrateConversations,
    canStartConversation,
    getConversationState,
    handleConversationClick,
  };
}
