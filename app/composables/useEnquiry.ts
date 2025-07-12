import { createSharedComposable } from '@vueuse/core';

/**
 * Enquiry Composable
 * Handles sending enquiries (conversations) to a user and prevents duplicates.
 */
export const useEnquiry = createSharedComposable(() => {
  const { loggedIn, user } = useUserSession();
  const requestFetch = useRequestFetch();

  // State
  const sentEnquiries = ref<number[]>([]); // User IDs already enquired
  const loadingEnquiries = ref(false);

  // Get current userId safely
  const currentUserId = computed(() => user.value?.id ?? null);

  /**
   * Hydrate sentEnquiries from backend conversations
   */
  async function hydrateEnquiries() {
    if (!loggedIn.value || !currentUserId.value) {
      sentEnquiries.value = [];
      return;
    }
    loadingEnquiries.value = true;
    try {
      const conversations = await requestFetch<any[]>('/api/conversation');
      const userIds = new Set<number>();
      conversations.forEach((conv) => {
        if (conv.senderId && conv.senderId !== currentUserId.value) userIds.add(conv.senderId);
        if (conv.receiverId && conv.receiverId !== currentUserId.value) userIds.add(conv.receiverId);
      });
      sentEnquiries.value = Array.from(userIds);
    } catch (error) {
      console.error('Error hydrating enquiries:', error);
    } finally {
      loadingEnquiries.value = false;
    }
  }

  // Auto-hydrate on login state change (client only)
  if (process.client) {
    watchEffect(() => {
      if (loggedIn.value) {
        hydrateEnquiries();
      } else {
        sentEnquiries.value = [];
      }
    });
  }

  /**
   * Check if an enquiry has already been sent to a user
   */
  function hasEnquired(targetUserId: number): boolean {
    return sentEnquiries.value.includes(targetUserId);
  }

  /**
   * Send an enquiry (create a conversation) to a user
   */
  async function sendEnquiry(receiverId: number, message: string) {
    if (!currentUserId.value || receiverId === currentUserId.value) {
      // Don't allow sending to self or without a valid user
      return;
    }
    if (hasEnquired(receiverId)) {
      return;
    }
    try {
      await requestFetch('/api/conversation/create', {
        method: 'POST',
        body: { receiverId, message },
      });
      sentEnquiries.value.push(receiverId);
    } catch (error) {
      console.error('Error sending enquiry:', error);
      throw error;
    }
  }

  return {
    hasEnquired,
    sendEnquiry,
    sentEnquiries,
    loadingEnquiries,
    hydrateEnquiries,
  };
});
