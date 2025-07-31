import { createSharedComposable } from '@vueuse/core';

/**
 * Enquiry Composable
 * Handles sending enquiries (conversations) to a user and prevents duplicates.
 */
export const useEnquiry = createSharedComposable(() => {
  const { loggedIn, user } = useUserSession();
  const requestFetch = useRequestFetch();
  const { showDialog } = useDialog();

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

  /**
   * Check if user can enquire about a listing
   */
  function canEnquire(listingId: number, receiverId?: number | null): boolean {
    if (!receiverId || typeof receiverId !== 'number' || isNaN(receiverId)) return false;
    if (receiverId === currentUserId.value) return false; // Can't enquire about own property
    if (hasEnquired(listingId)) return false;
    return true;
  }

  /**
   * Get enquiry button state for UI
   */
  function getEnquiryState(listingId: number, receiverId?: number | null) {
    const safeReceiverId = typeof receiverId === 'number' && !isNaN(receiverId) ? receiverId : null;
    const isSelf = safeReceiverId !== null && currentUserId.value === safeReceiverId;
    const alreadyEnquired = hasEnquired(listingId);
    
    return {
      isDisabled: !safeReceiverId || alreadyEnquired || loadingEnquiries.value || isSelf,
      label: isSelf ? 'Self Listing' : alreadyEnquired ? 'Enquiry sent' : 'Enquire now',
      canEnquire: canEnquire(listingId, receiverId)
    };
  }

  /**
   * Handle enquiry button click - opens appropriate dialog
   */
  async function handleEnquiryClick(listingId: number, receiverId?: number | null) {
    // Lazy import to avoid circular dependencies
    const [{ default: ViewsDialogLogin }, { default: ViewsDialogEnquiry }] = await Promise.all([
      import('~/components/views/Dialog/ViewsDialogLogin.vue'),
      import('~/components/views/Dialog/ViewsDialogEnquiry.vue')
    ]);

    if (!user.value || !user.value.id) {
      showDialog({
        component: ViewsDialogLogin,
      });
      return;
    }

    if (canEnquire(listingId, receiverId)) {
      showDialog({
        component: ViewsDialogEnquiry,
        props: { listingId, receiverId },
      });
    }
  }

  return {
    hasEnquired,
    sendEnquiry,
    sentEnquiries,
    loadingEnquiries,
    hydrateEnquiries,
    canEnquire,
    getEnquiryState,
    handleEnquiryClick,
  };
});
