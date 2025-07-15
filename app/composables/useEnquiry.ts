import { createSharedComposable } from '@vueuse/core';

/**
 * Enquiry Composable
 * Handles sending enquiries (conversations) to a user and prevents duplicates.
 */
export const useEnquiry = createSharedComposable(() => {
  const { loggedIn, user } = useUserSession();
  const requestFetch = useRequestFetch();

  // State
  const sentEnquiries = ref<number[]>([]); // Listing IDs already enquired
  const loadingEnquiries = ref(false);

  // Get current userId safely
  const currentUserId = computed(() => user.value?.id ?? null);

  /**
   * Hydrate sentEnquiries from backend - optimized to fetch only listing IDs
   */
  async function hydrateEnquiries() {
    if (!loggedIn.value || !currentUserId.value) {
      sentEnquiries.value = [];
      return;
    }
    loadingEnquiries.value = true;
    try {
      const listingIds = await requestFetch<number[]>('/api/conversation/sent');
      sentEnquiries.value = listingIds;
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
   * Check if an enquiry has already been sent for a listing
   */
  function hasEnquired(listingId: number): boolean {
    return sentEnquiries.value.includes(listingId);
  }

  /**
   * Send an enquiry (create a conversation) about a listing
   */
  async function sendEnquiry(listingId: number, receiverId: number, message: string) {
    if (!currentUserId.value || receiverId === currentUserId.value) {
      // Don't allow sending to self or without a valid user
      return;
    }
    if (hasEnquired(listingId)) {
      return;
    }
    try {
      await requestFetch('/api/conversation/create', {
        method: 'POST',
        body: { listingId, receiverId, message },
      });
      sentEnquiries.value.push(listingId);
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
