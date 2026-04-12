import { today as getToday, getLocalTimeZone } from "@internationalized/date";
import type { CalendarDate, DateValue } from "@internationalized/date";

/**
 * Manages all state and logic for requesting and tracking viewings within
 * an enquiry conversation. Accepts getter functions so it stays reactive
 * without coupling directly to a parent component's props shape.
 */
export function useViewingRequest(
  conversation: () => ConversationWithMinimalListing | null,
  isOwner: () => boolean,
) {
  const { requestViewing, getConversationViewings, hasActiveViewingAsRequester } = useViewings();
  const toast = useToast();

  // ─── State ─────────────────────────────────────────────────────────────────

  const viewingToday = getToday(getLocalTimeZone());
  const viewingPopoverOpen = ref(false);
  /** Multiple selected dates (CalendarDate[]) */
  const viewingDates = shallowRef<DateValue[]>([]);
  /** Selected time preferences (e.g. ['Mornings', 'Evenings']) */
  const viewingTimes = ref<string[]>([]);
  /** Freeform time text shown when 'Other...' is selected */
  const viewingOtherTime = ref("");
  const viewingNotes = ref("");
  const viewingSubmitting = ref(false);

  // ─── Computed ──────────────────────────────────────────────────────────────

  const conversationViewings = computed(() => {
    const convo = conversation();
    if (!convo?.id) return [];
    return getConversationViewings(convo.id);
  });

  /** Viewings that are still active (not yet terminal) */
  const activeConversationViewings = computed(() =>
    conversationViewings.value.filter((v) =>
      v.status === "PENDING" || v.status === "RESCHEDULED" || v.status === "ACCEPTED",
    ),
  );

  const hasActiveViewing = computed(() => {
    const convo = conversation();
    if (!convo?.listing?.id) return false;
    return hasActiveViewingAsRequester(convo.listing.id);
  });

  // ─── Methods ───────────────────────────────────────────────────────────────

  function formatViewingDate(isoString: string): string {
    return new Date(isoString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function viewingStatusColor(
    status: string,
  ): "success" | "warning" | "error" | "secondary" | "neutral" {
    if (status === "ACCEPTED") return "success";
    if (status === "PENDING") return "warning";
    if (status === "REJECTED") return "error";
    if (status === "RESCHEDULED") return "secondary";
    return "neutral";
  }

  /** Buyer accepts the owner's counter-proposed time directly from the popover */
  async function acceptCounterViewing(id: number) {
    const { respondToViewing } = useViewings();
    const result = await respondToViewing(id, { response: "accept" });
    if (result) {
      toast.add({
        title: "Viewing confirmed",
        description: "The time has been accepted.",
        color: "success",
        icon: "i-lucide-calendar-check",
      });
      viewingPopoverOpen.value = false;
    } else {
      toast.add({ title: "Error", description: "Failed to confirm viewing.", color: "error", icon: "i-lucide-circle-x" });
    }
  }

  async function submitViewingRequest() {
    const convo = conversation();
    const listing = convo?.listing;
    if (!listing?.id || !listing.userId || !viewingDates.value.length || !viewingTimes.value.length) return;

    // Replace 'Other...' sentinel with the freeform time text (or 'Other' if no text)
    const finalTimes = viewingTimes.value.map(t =>
      t === 'Other...' ? (viewingOtherTime.value.trim() || 'Other') : t,
    ).filter(Boolean);

    // Convert CalendarDate objects to YYYY-MM-DD strings
    const proposedDates = (viewingDates.value as CalendarDate[]).map(d => d.toString());

    viewingSubmitting.value = true;
    try {
      await requestViewing({
        listingId: listing.id,
        ownerId: listing.userId,
        proposedDates,
        preferredTimes: finalTimes,
        notes: viewingNotes.value || undefined,
        conversationId: convo?.id,
      });

      toast.add({
        title: "Viewing requested",
        description: "The owner has been notified.",
        color: "success",
        icon: "i-lucide-calendar-check",
      });

      viewingPopoverOpen.value = false;
      viewingDates.value = [];
      viewingTimes.value = [];
      viewingOtherTime.value = "";
      viewingNotes.value = "";
    } catch {
      toast.add({
        title: "Error",
        description: "Failed to request viewing.",
        color: "error",
        icon: "i-lucide-circle-x",
      });
    } finally {
      viewingSubmitting.value = false;
    }
  }

  return {
    viewingToday,
    viewingPopoverOpen,
    viewingDates,
    viewingTimes,
    viewingOtherTime,
    viewingNotes,
    viewingSubmitting,
    conversationViewings,
    activeConversationViewings,
    hasActiveViewing,
    formatViewingDate,
    viewingStatusColor,
    submitViewingRequest,
    acceptCounterViewing,
  };
}
