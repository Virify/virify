import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import type { User } from "#auth-utils";

/**
 * Manages all state and logic for the enquiry modal.
 * Extracts messaging, media upload, read-marking, and availability logic so
 * the modal template stays presentational.
 */
export function useEnquiryModal(
  props: {
    conversation: ConversationWithMinimalListing | null;
    user: User | null;
    open: boolean;
  },
  emit: (e: "update:open", value: boolean) => void,
) {
  const { sendReply, markMessageAsRead, activeEnquiry } = useEnquiries();
  const { markAsRead } = useNotifications();
  const { setAvailabilityStatus } = useMyListings();
  const { uploadFile, deleteFile, getFileUrl, isUploading } = useCloudflareR2();
  const toast = useToast();
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const activeBreakpoints = breakpoints.active();

  // ─── State ─────────────────────────────────────────────────────────────────

  const messageContent = ref("");
  const chatContainer = ref<HTMLElement | null>(null);
  const localMessages = ref<any[]>([]);
  const processedMessageIds = new Set<number>();
  const isMarkingAsRead = ref(false);
  const isUpdatingEnquiryStatus = ref(false);
  const pendingMedia = ref<UserMediaRecord | null>(null);
  const isDeletingMedia = ref(false);
  const fileInputRef = ref<HTMLInputElement | null>(null);
  const emojiPickerOpen = ref(false);

  const enquiryAvailabilityStatus = ref<string>(
    props.conversation?.listing?.saleListing?.availabilityStatus ??
      props.conversation?.listing?.rentalListing?.availabilityStatus ??
      "AVAILABLE",
  );

  // ─── Computed ──────────────────────────────────────────────────────────────

  const isOwner = computed(() => {
    if (!props.conversation?.listing?.userId || !props.user?.id) return false;
    return props.conversation.listing.userId === props.user.id;
  });

  const enquiryAvailabilityItems = computed(() => {
    const listing = props.conversation?.listing;
    if (!listing) return [];
    if (listing.saleListing) return saleAvailabilityItems;
    if (listing.rentalListing) return rentalAvailabilityItems;
    return [];
  });

  const isMobile = computed(() => {
    return (
      !activeBreakpoints.value.includes("md") &&
      !activeBreakpoints.value.includes("lg") &&
      !activeBreakpoints.value.includes("xl") &&
      !activeBreakpoints.value.includes("2xl")
    );
  });

  const otherUser = computed(() => {
    if (!props.conversation || !props.user?.id) return null;
    return props.conversation.sender?.id === props.user.id
      ? props.conversation.receiver
      : props.conversation.sender;
  });

  const subTitle = computed(() => {
    const listing = props.conversation?.listing;
    if (!listing?.property?.address) return "Address not provided";

    const { street, city, postcode, fullAddress } = listing.property.address as any;
    const parts = [street, city, postcode].filter(Boolean);
    const address = parts.length > 0 ? parts.join(", ") : fullAddress || "Address not provided";

    const price = listing.price
      ? new Intl.NumberFormat("en-GB", {
          style: "currency",
          currency: "GBP",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(Number(listing.price))
      : null;

    return price ? `${price} - ${address}` : address;
  });

  // ─── Methods ───────────────────────────────────────────────────────────────

  function scrollToBottom() {
    nextTick(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
      }
    });
  }

  async function handleEnquiryAvailabilityChange(value: string | number | boolean | null) {
    const listingId = props.conversation?.listing?.id;
    if (!listingId || !value || typeof value !== "string") return;
    isUpdatingEnquiryStatus.value = true;
    const previous = enquiryAvailabilityStatus.value;
    try {
      await setAvailabilityStatus(listingId, value as AvailabilityOptions);
      toast.add({
        title: "Status updated",
        description: enquiryAvailabilityItems.value.find((i) => i.value === value)?.label ?? value,
        color: "success",
        icon: "i-lucide-check-circle",
      });
    } catch {
      enquiryAvailabilityStatus.value = previous;
      toast.add({ title: "Error", description: "Failed to update listing status", color: "error", icon: "i-lucide-circle-x" });
    } finally {
      isUpdatingEnquiryStatus.value = false;
    }
  }

  async function handleSendMessage() {
    const hasContent = messageContent.value.trim().length > 0;
    const hasMedia = !!pendingMedia.value;
    if (!hasContent && !hasMedia) return;
    if (!props.conversation?.id) return;

    const mediaId = pendingMedia.value?.id;
    try {
      await sendReply(props.conversation.id, messageContent.value, { mediaId });
      messageContent.value = "";
      pendingMedia.value = null;
      // Reset the file input inside the footer if it exists
      if (fileInputRef.value) fileInputRef.value.value = "";
    } catch (e) {
      console.error("Failed to send message", e);
    }
  }

  async function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const result = await uploadFile(file);
    if (result) pendingMedia.value = result;
    // Reset so the same file can be reselected
    input.value = "";
  }

  async function removePendingMedia() {
    if (!pendingMedia.value) return;
    isDeletingMedia.value = true;
    try {
      await deleteFile(pendingMedia.value.id);
      pendingMedia.value = null;
    } finally {
      isDeletingMedia.value = false;
    }
  }

  function onEmojiSelect(emoji: string) {
    messageContent.value += emoji;
    emojiPickerOpen.value = false;
  }

  async function markMessagesAsRead() {
    if (!props.conversation?.messages || !props.conversation?.id || !props.user?.id) return;
    if (isMarkingAsRead.value) return;

    const unreadMessages = props.conversation.messages.filter(
      (message: any) => !message.isRead && message.receiverId === props.user!.id,
    );
    if (unreadMessages.length === 0) return;

    isMarkingAsRead.value = true;
    try {
      await markAsRead({ conversationId: props.conversation.id, unreadMessageCount: unreadMessages.length });

      const messagesToMark = unreadMessages.filter((m: any) => !processedMessageIds.has(m.id));
      if (messagesToMark.length === 0) return;

      messagesToMark.forEach((m: any) => processedMessageIds.add(m.id));
      await Promise.all(
        messagesToMark.map(async (message: any) => {
          try {
            await markMessageAsRead(message.id, props.conversation!.id);
          } catch (e) {
            console.error(`Failed to mark message ${message.id} as read`, e);
            processedMessageIds.delete(message.id);
          }
        }),
      );
    } finally {
      isMarkingAsRead.value = false;
    }
  }

  // ─── Watchers ──────────────────────────────────────────────────────────────

  // Sync local messages with activeEnquiry — WebSocket updates flow through here
  watch(
    () => activeEnquiry.value?.messages,
    (newMessages) => {
      if (newMessages && props.open) {
        localMessages.value = [...newMessages];
        scrollToBottom();
        markMessagesAsRead();
      }
    },
    { deep: true },
  );

  // Initialise on open; clean up orphaned pending media on close
  watch(
    () => props.open,
    (newVal) => {
      if (newVal && props.conversation?.messages) {
        processedMessageIds.clear();
        localMessages.value = [...props.conversation.messages];
        scrollToBottom();
        markMessagesAsRead();
      } else if (!newVal && pendingMedia.value) {
        deleteFile(pendingMedia.value.id).catch(() => {});
        pendingMedia.value = null;
      }
    },
    { immediate: true },
  );

  // Handle conversation prop updates (e.g. external refresh)
  watch(
    () => props.conversation,
    (newVal) => {
      if (newVal?.messages && props.open) {
        processedMessageIds.clear();
        localMessages.value = [...newVal.messages];
        scrollToBottom();
        markMessagesAsRead();
      }
    },
    { deep: true },
  );

  return {
    // Refs
    messageContent,
    chatContainer,
    localMessages,
    isMarkingAsRead,
    isUpdatingEnquiryStatus,
    pendingMedia,
    isDeletingMedia,
    fileInputRef,
    emojiPickerOpen,
    enquiryAvailabilityStatus,
    // Computed
    isOwner,
    isMobile,
    otherUser,
    subTitle,
    enquiryAvailabilityItems,
    // Cloudflare
    isUploading,
    getFileUrl,
    // Methods
    scrollToBottom,
    handleSendMessage,
    handleFileChange,
    removePendingMedia,
    onEmojiSelect,
    markMessagesAsRead,
    handleEnquiryAvailabilityChange,
  };
}
