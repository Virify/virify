import { createSharedComposable } from "@vueuse/core";
import type {
  OpenHouseSession,
  CreateOpenHouseSessionPayload,
} from "~~/shared/types/open-house";
import type { ViewingWithDetails } from "~~/shared/types/viewing";

// Module-level cache — persists across component mounts (singleton via createSharedComposable)
const sessionsByListing = ref<Map<number, OpenHouseSession[]>>(new Map());

export const useOpenHouse = createSharedComposable(() => {
  const requestFetch = useRequestFetch();
  const toast = useToast();
  const { viewings } = useViewings();

  // ─── Fetch ─────────────────────────────────────────────────────────────────

  async function fetchSessionsForListing(listingId: number): Promise<void> {
    try {
      const data = await requestFetch<OpenHouseSession[]>(
        `/api/open-house/${listingId}`,
      );
      sessionsByListing.value = new Map(sessionsByListing.value).set(
        listingId,
        data ?? [],
      );
    } catch (err) {
      console.error("Error fetching open house sessions:", err);
    }
  }

  // ─── Reads ─────────────────────────────────────────────────────────────────

  function getSessionsForListing(listingId: number): OpenHouseSession[] {
    return sessionsByListing.value.get(listingId) ?? [];
  }

  function hasUpcomingOpenHouse(listingId: number): boolean {
    return getSessionsForListing(listingId).length > 0;
  }

  // ─── Owner actions ─────────────────────────────────────────────────────────

  async function createSession(
    payload: CreateOpenHouseSessionPayload,
  ): Promise<OpenHouseSession | null> {
    try {
      const session = await requestFetch<OpenHouseSession>("/api/open-house", {
        method: "POST",
        body: payload,
      });
      const current = sessionsByListing.value.get(payload.listingId) ?? [];
      sessionsByListing.value = new Map(sessionsByListing.value).set(
        payload.listingId,
        [...current, session].sort((a, b) => a.date.localeCompare(b.date)),
      );
      return session;
    } catch (err) {
      console.error("Error creating open house session:", err);
      return null;
    }
  }

  async function deleteSession(
    id: number,
    listingId: number,
  ): Promise<boolean> {
    try {
      await requestFetch(`/api/open-house/${id}`, { method: "DELETE" });
      const current = sessionsByListing.value.get(listingId) ?? [];
      sessionsByListing.value = new Map(sessionsByListing.value).set(
        listingId,
        current.filter((s) => s.id !== id),
      );
      return true;
    } catch (err) {
      console.error("Error deleting open house session:", err);
      return false;
    }
  }

  // ─── Enquirer actions ──────────────────────────────────────────────────────

  /**
   * Book a 15-min slot in an open house session.
   * Creates a Viewing with ACCEPTED status immediately.
   * Updates the local session cache to mark the slot as booked.
   */
  async function bookSlot(
    sessionId: number,
    slotTime: string,
    listingId: number,
    conversationId?: number,
  ): Promise<ViewingWithDetails | null> {
    try {
      const viewing = await requestFetch<ViewingWithDetails>(
        `/api/open-house/${sessionId}/book`,
        {
          method: "POST",
          body: { slotTime, conversationId },
        },
      );

      // Update local session cache — mark this slot as booked
      const current = sessionsByListing.value.get(listingId) ?? [];
      const session = current.find((s) => s.id === sessionId);
      if (session) {
        const slotLabel = slotLabelFromTime(slotTime, session.slotMins);
        sessionsByListing.value = new Map(sessionsByListing.value).set(
          listingId,
          current.map((s) =>
            s.id === sessionId
              ? { ...s, bookedSlots: [...s.bookedSlots, slotLabel] }
              : s,
          ),
        );
      }

      // Add the confirmed viewing to the shared viewings ref so the sidebar badge updates
      const { fetchViewings } = useViewings();
      fetchViewings().catch((err) =>
        console.error(
          "Failed to refresh viewings after open house booking:",
          err,
        ),
      );

      toast.add({
        title: "Slot booked!",
        description: `Your ${slotLabelFromTime(slotTime, session?.slotMins ?? 15)} slot has been confirmed.`,
        color: "success",
        icon: "i-lucide-calendar-check",
      });

      return viewing;
    } catch (err: any) {
      const msg = err?.data?.statusMessage ?? "Failed to book slot";
      toast.add({
        title: "Booking failed",
        description: msg,
        color: "error",
        icon: "i-lucide-circle-x",
      });
      return null;
    }
  }

  return {
    sessionsByListing: readonly(sessionsByListing),
    fetchSessionsForListing,
    getSessionsForListing,
    hasUpcomingOpenHouse,
    createSession,
    deleteSession,
    bookSlot,
  };
});
