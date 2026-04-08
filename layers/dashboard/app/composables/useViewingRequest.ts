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
  const viewingDate = ref<DateValue>(viewingToday);
  const viewingTime = ref("10:00");
  const viewingNotes = ref("");
  const viewingSubmitting = ref(false);

  // ─── Computed ──────────────────────────────────────────────────────────────

  const conversationViewings = computed(() => {
    const convo = conversation();
    if (!convo?.id) return [];
    return getConversationViewings(convo.id);
  });

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

  async function submitViewingRequest() {
    const convo = conversation();
    const listing = convo?.listing;
    if (!listing?.id || !listing.userId || !viewingDate.value || !viewingTime.value) return;

    viewingSubmitting.value = true;
    try {
      const [hours, minutes] = viewingTime.value.split(":").map(Number);
      const native = (viewingDate.value as CalendarDate).toDate(getLocalTimeZone());
      native.setHours(hours!, minutes!, 0, 0);

      await requestViewing({
        listingId: listing.id,
        ownerId: listing.userId,
        proposedAt: native.toISOString(),
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
      viewingDate.value = viewingToday;
      viewingTime.value = "10:00";
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
    viewingDate,
    viewingTime,
    viewingNotes,
    viewingSubmitting,
    conversationViewings,
    hasActiveViewing,
    formatViewingDate,
    viewingStatusColor,
    submitViewingRequest,
  };
}
