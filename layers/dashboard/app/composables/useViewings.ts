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
      return true;
    } catch (err) {
      console.error("Error cancelling viewing:", err);
      return false;
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

  async function fetchViewings(): Promise<void> {
    if (!user.value?.id) return;
    try {
      const data = await requestFetch<{ viewings: ViewingWithDetails[] }>("/api/viewing");
      viewings.value = data.viewings ?? [];
    } catch (err) {
      console.error("Error fetching viewings:", err);
    }
  }

  return {
    viewings: readonly(viewings),
    pendingViewings,
    pendingCount,
    requestViewing,
    respondToViewing,
    cancelViewing,
    getConversationViewings,
    hasActiveViewingAsRequester,
    fetchViewings,
  };
});
