import { createSharedComposable } from "@vueuse/core";

const viewings = ref<ViewingWithDetails[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

export const useViewings = createSharedComposable(() => {
  const requestFetch = useRequestFetch();
  const { user } = useUserSession();

  const pendingViewings = computed(() => viewings.value.filter((v) => v.status === "PENDING"));
  const pendingCount = computed(() => pendingViewings.value.length);

  // ─── Actions ─────────────────────────────────────────────────────────────────

  async function requestViewing(payload: CreateViewingPayload): Promise<ViewingWithDetails | null> {
    try {
      const created = await requestFetch<ViewingWithDetails>("/api/viewing/create", {
        method: "POST",
        body: payload,
      });
      viewings.value = [...viewings.value, created];
      // Refresh aggregates so the requester's sidebar badge updates immediately
      const { fetchUserItemsAggregates } = useNotifications();
      fetchUserItemsAggregates(true).catch((e) => console.error("Failed to refresh aggregates after viewing request:", e));
      return created;
    } catch (err) {
      console.error("Error requesting viewing:", err);
      return null;
    }
  }

  async function respondToViewing(id: number, payload: RespondViewingPayload): Promise<ViewingWithDetails | null> {
    try {
      const updated = await requestFetch<ViewingWithDetails>(`/api/viewing/${id}/respond`, {
        method: "PATCH",
        body: payload,
      });
      const idx = viewings.value.findIndex((v) => v.id === id);
      if (idx !== -1) viewings.value[idx] = updated;
      // Re-fetch to sync the shared ref and pick up cache bust from server
      fetchViewings().catch((err) => console.error("Failed to refresh viewings after respond:", err));
      return updated;
    } catch (err) {
      console.error("Error responding to viewing:", err);
      return null;
    }
  }

  async function cancelViewing(id: number): Promise<boolean> {
    try {
      await requestFetch(`/api/viewing/${id}/cancel`, { method: "DELETE" });
      const idx = viewings.value.findIndex((v) => v.id === id);
      if (idx !== -1) viewings.value[idx] = { ...viewings.value[idx]!, status: "CANCELLED" };
      // Re-fetch to sync the shared ref after cache bust
      fetchViewings().catch((err) => console.error("Failed to refresh viewings after cancel:", err));
      return true;
    } catch (err) {
      console.error("Error cancelling viewing:", err);
      return false;
    }
  }

  async function counterProposeViewing(id: number, payload: CounterProposeViewingPayload): Promise<ViewingWithDetails | null> {
    try {
      const updated = await requestFetch<ViewingWithDetails>(`/api/viewing/${id}/propose`, {
        method: "PATCH",
        body: payload,
      });
      const idx = viewings.value.findIndex((v) => v.id === id);
      if (idx !== -1) viewings.value[idx] = updated;
      fetchViewings().catch((err) => console.error("Failed to refresh viewings after counter-propose:", err));
      return updated;
    } catch (err) {
      console.error("Error counter-proposing viewing:", err);
      return null;
    }
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  /** Get all viewings for a specific conversation */
  function getConversationViewings(conversationId: number): ViewingWithDetails[] {
    return viewings.value.filter((v) => v.conversationId === conversationId);
  }

  /**
   * Check if the current user has an active (PENDING or RESCHEDULED) viewing
   * request as the requester for a given listing.
   */
  function hasActiveViewingAsRequester(listingId: number): boolean {
    if (!user.value?.id) return false;
    return viewings.value.some((v) => v.listingId === listingId && v.requesterId === user.value!.id && (v.status === "PENDING" || v.status === "RESCHEDULED"));
  }

  /**
   * Return the most relevant active viewing for the current user as requester.
   * Priority: ACCEPTED > RESCHEDULED > PENDING. CANCELLED/REJECTED are ignored.
   */
  function getActiveViewingForListing(listingId: number): ViewingWithDetails | null {
    if (!user.value?.id) return null;
    const priority: ViewingStatus[] = ['ACCEPTED', 'RESCHEDULED', 'PENDING'];
    for (const status of priority) {
      const found = viewings.value.find(
        (v) => v.listingId === listingId && v.requesterId === (user.value!.id as number) && v.status === status,
      );
      if (found) return found;
    }
    return null;
  }

  /** Human-readable label for a viewing's status as a buyer. */
  function getViewingStatusLabel(viewing: ViewingWithDetails): string {
    if (viewing.status === 'ACCEPTED') {
      const confirmedDate = viewing.counterProposedAt ?? viewing.proposedDates[0];
      if (confirmedDate) {
        const d = new Date(confirmedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        return `Viewing on ${d}`;
      }
      return 'Viewing Confirmed';
    }
    if (viewing.status === 'RESCHEDULED') return 'New Time Proposed';
    return 'Viewing Pending';
  }

  async function fetchViewings(sort: 'newest' | 'oldest' = 'newest'): Promise<void> {
    if (!user.value?.id) return;
    loading.value = true;
    try {
      const data = await requestFetch<ViewingWithDetails[]>(`/api/viewing?sort=${sort}`);
      viewings.value = data ?? [];
    } catch (err) {
      console.error("Error fetching viewings:", err);
    } finally {
      loading.value = false;
    }
  }

  return {
    viewings: readonly(viewings),
    loading: readonly(loading),
    pendingViewings,
    pendingCount,
    requestViewing,
    respondToViewing,
    cancelViewing,
    counterProposeViewing,
    getConversationViewings,
    hasActiveViewingAsRequester,
    getActiveViewingForListing,
    getViewingStatusLabel,
    fetchViewings,
  };
});
