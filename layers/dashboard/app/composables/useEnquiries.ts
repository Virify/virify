
/**
 * Global state - shared across all composable instances
 * This ensures state is consistent when multiple components use useEnquiries
 */
const enquiries = ref<ConversationWithMinimalListing[]>([]);
const total = ref(0);
const loading = ref(false);
const error = ref<string | null>(null);

// Active enquiry being viewed in modal
const activeEnquiry = ref<ConversationWithMinimalListing | null>(null);
const activeEnquiryId = computed(() => activeEnquiry.value?.id ?? null);

// Track which listings user has already contacted (for "Contact now" button state)
const contactedListings = ref<Set<number>>(new Set());
const contactedListingsLoading = ref(false);

/**
 * Streamlined enquiries composable for dashboard
 * 
 * Responsibilities:
 * - Fetch and manage enquiries state
 * - Handle WebSocket updates (add/update enquiries and messages)
 * - Track active enquiry for modal
 * - Provide actions: sendReply, markAsRead
 * 
 * Usage:
 * - Dashboard enquiries pages (index.vue, [id].vue)
 * - Enquiry modal (OrganismsDashboardEnquiryModal.vue)
 * - ViewsDialogConversation.vue (for starting new conversations)
 */
export function useEnquiries() {
  const { loggedIn, user } = useUserSession();
  const requestFetch = useRequestFetch();

  const currentUserId = computed(() => user.value?.id ?? null);

  // ─────────────────────────────────────────────────────────────────────────────
  // FETCH METHODS
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Fetch enquiries from API with filters
   */
  async function fetchEnquiries(options?: {
    filter?: 'all' | 'unread';
    direction?: 'all' | 'sent' | 'received';
    sort?: 'newest' | 'oldest' | 'listing';
    page?: number;
    limit?: number;
    listingId?: number;
  }) {
    if (!canFetchEnquiries(loggedIn.value, currentUserId.value)) {
      enquiries.value = [];
      total.value = 0;
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const url = buildEnquiryUrl(options);
      const data = await requestFetch<{ conversations: ConversationWithMinimalListing[]; total: number }>(url);
      enquiries.value = data.conversations || [];
      total.value = data.total || 0;
    } catch (err) {
      console.error('Error fetching enquiries:', err);
      error.value = 'Failed to load enquiries';
      enquiries.value = [];
      total.value = 0;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Hydrate contacted listings from backend
   * Used to track which listings user has already contacted
   */
  async function hydrateContactedListings() {
    if (!canFetchEnquiries(loggedIn.value, currentUserId.value)) {
      contactedListings.value = new Set();
      return;
    }

    contactedListingsLoading.value = true;
    try {
      const listingIds = await requestFetch<number[]>('/api/conversation/sent');
      contactedListings.value = new Set(listingIds);
    } catch (err) {
      console.error('Error hydrating contacted listings:', err);
    } finally {
      contactedListingsLoading.value = false;
    }
  }

  // Auto-hydrate on login (client only)
  if (import.meta.client) {
    watchEffect(() => {
      if (loggedIn.value) {
        hydrateContactedListings();
      } else {
        contactedListings.value = new Set();
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // WEBSOCKET UPDATE HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Handle new conversation from WebSocket
   * Adds conversation to list if not already present
   */
  function handleNewConversation(conversation: ConversationWithMinimalListing) {
    // Prevent duplicates - check if conversation exists
    const exists = findConversation(enquiries.value, conversation.id);
    if (!exists) {
      enquiries.value = [conversation, ...enquiries.value];
      total.value += 1;
    }
  }

  /**
   * Handle new message from WebSocket
   * Updates existing conversation or adds new one
   */
  function handleNewMessage(conversationId: number, message: MessageWithUser, conversation?: ConversationWithMinimalListing) {
    const index = enquiries.value.findIndex(e => e.id === conversationId);

    if (index !== -1) {
      // Update existing conversation
      const existing = enquiries.value[index];
      if (!existing) return;

      // Prevent duplicate messages
      if (messageExists(existing.messages, message.id)) {
        return;
      }

      // Create updated conversation with new message
      const updated: ConversationWithMinimalListing = {
        ...existing,
        messages: [...existing.messages, message],
        updatedAt: new Date(),
      };

      // Move to top of list
      const newList = [...enquiries.value];
      newList.splice(index, 1);
      enquiries.value = [updated, ...newList];

      // Also update activeEnquiry if it's the same conversation
      if (isActiveConversation(conversationId, activeEnquiryId.value)) {
        activeEnquiry.value = updated;
      }
    } else if (conversation) {
      // New conversation not in list - add it
      const messages = conversation.messages || [];
      const hasMessage = messageExists(messages, message.id);

      const conversationToAdd = {
        ...conversation,
        messages: hasMessage ? messages : [...messages, message],
        updatedAt: new Date(),
      };

      enquiries.value = [conversationToAdd, ...enquiries.value];
      total.value += 1;
    }
  }

  /**
   * Handle message read status from WebSocket
   */
  function handleMessageRead(conversationId: number, messageId: number) {
    const updated = markMessageAsReadInConversation(enquiries.value, conversationId, messageId);
    if (!updated) return;

    enquiries.value = updateConversationInList(enquiries.value, conversationId, updated);

    // Update activeEnquiry if needed
    if (activeEnquiry.value?.id === conversationId) {
      activeEnquiry.value = updated;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Send a reply message
   */
  async function sendReply(conversationId: number, content: string, options?: { suppressNotification?: boolean }) {
    if (!content.trim() || !currentUserId.value) {
      throw new Error('Message content is required');
    }

    const response = await $fetch<MessageWithUser>('/api/conversation/reply/', {
      method: 'POST',
      body: { message: content, conversationId, suppressNotification: options?.suppressNotification === true },
    });

    return response;
  }

  /**
   * Start a new conversation
   */
  async function startConversation(listingId: number, receiverId: number, message: string) {
    if (!currentUserId.value || receiverId === currentUserId.value) {
      return;
    }

    if (hasContactedListing(listingId)) {
      return;
    }

    await requestFetch('/api/conversation/create', {
      method: 'POST',
      body: { listingId, receiverId, message },
    });

    // Track that we've contacted this listing
    contactedListings.value.add(listingId);
  }

  /**
   * Mark a message as read
   */
  async function markMessageAsRead(messageId: number, conversationId: number) {
    // Optimistic update
    handleMessageRead(conversationId, messageId);

    try {
      await $fetch('/api/conversation/mark-read', {
        method: 'POST',
        body: { messageId, conversationId },
      });
    } catch (err) {
      console.error('Error marking message as read:', err);
      // Could revert optimistic update here if needed
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MODAL STATE
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Open enquiry modal for a specific conversation
   */
  function openEnquiry(enquiry: ConversationWithMinimalListing) {
    activeEnquiry.value = enquiry;
  }

  /**
   * Close enquiry modal
   */
  function closeEnquiry() {
    activeEnquiry.value = null;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // UTILITIES
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Check if user has already contacted a listing
   */
  function hasContactedListing(listingId: number): boolean {
    return contactedListings.value.has(listingId);
  }

  /**
   * Check if user can start a conversation for a listing
   */
  function canStartConversation(listingId: number, receiverId?: number | null): boolean {
    if (!receiverId || typeof receiverId !== 'number' || isNaN(receiverId)) return false;
    if (receiverId === currentUserId.value) return false;
    if (hasContactedListing(listingId)) return false;
    return true;
  }

  /**
   * Get conversation button state for UI
   */
  function getConversationButtonState(listingId: number, receiverId?: number | null) {
    const safeReceiverId = typeof receiverId === 'number' && !isNaN(receiverId) ? receiverId : null;
    const isSelf = safeReceiverId !== null && currentUserId.value === safeReceiverId;
    const alreadyContacted = hasContactedListing(listingId);

    return {
      isDisabled: !safeReceiverId || alreadyContacted || contactedListingsLoading.value || isSelf,
      label: isSelf ? 'Self Listing' : alreadyContacted ? 'Message sent' : 'Contact now',
      canStart: canStartConversation(listingId, receiverId),
    };
  }

  /**
   * Get unread count for a specific conversation
   */
  function getUnreadCount(conversation: ConversationWithMinimalListing): number {
    if (!currentUserId.value || !conversation.messages) return 0;
    return conversation.messages.filter(
      m => !m.isRead && m.receiverId === currentUserId.value
    ).length;
  }

  /**
   * Get total unread count across all enquiries
   */
  const totalUnreadCount = computed(() => {
    return enquiries.value.reduce((sum, e) => sum + getUnreadCount(e), 0);
  });

  return {
    // State (not readonly to allow component compatibility)
    enquiries,
    total: readonly(total),
    loading: readonly(loading),
    error: readonly(error),
    currentUserId: readonly(currentUserId),

    // Active enquiry (modal state)
    activeEnquiry,
    activeEnquiryId,
    openEnquiry,
    closeEnquiry,

    // Fetch methods
    fetchEnquiries,
    hydrateContactedListings,

    // WebSocket handlers (called from plugin)
    handleNewConversation,
    handleNewMessage,
    handleMessageRead,

    // Actions
    sendReply,
    startConversation,
    markMessageAsRead,

    // Utilities
    hasContactedListing,
    canStartConversation,
    getConversationButtonState,
    getUnreadCount,
    totalUnreadCount,
    contactedListingsLoading: readonly(contactedListingsLoading),
  };
}
