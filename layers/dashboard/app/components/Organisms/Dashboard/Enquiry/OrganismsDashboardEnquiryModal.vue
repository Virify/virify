<template>
  <UModal v-model:open="isOpen" :fullscreen="isMobile" :ui="{
    overlay: 'bg-black/50 backdrop-blur-sm',
    content: 'max-w-[1300px] w-full sm:w-[90vw]',
    description: 'pl-10 body-sm',
    body: 'py-6 px-0!',
  }">
    <template #title>
      <div class="flex items-center gap-3">
        <UAvatar :src="otherUser?.avatar || undefined" :alt="otherUser?.username!" :name="otherUser?.username!" size="lg" class="bg-(--background-300)" />
        <div class="flex flex-col gap-1 flex-wrap">
          <h2 class="text-sm font-bold leading-none">{{ otherUser?.username || "Unknown User" }}</h2>
          <p class="text-xs text-(--foreground-200)/80 truncate mt-1 font-normal">
            {{ subTitle }}
          </p>
          <USelect
            v-if="isOwner && enquiryAvailabilityItems.length > 0"
            v-model="enquiryAvailabilityStatus"
            :items="enquiryAvailabilityItems"
            :disabled="isUpdatingEnquiryStatus"
            size="xs"
            color="secondary"
            class="mt-1 w-36"
            :ui="{ value: 'text-sm font-normal' }"
            @update:model-value="handleEnquiryAvailabilityChange"
          />
        </div>
      </div>
    </template>
    <template #body>
      <div ref="chatContainer" class="overflow-y-auto px-4 scroll-smooth" :class="isMobile ? 'h-full' : 'h-[60vh]'">
        <UChatMessages should-auto-scroll>
          <UChatMessage v-for="message in localMessages"
            :variant="isMessageFromUser(message, user?.id!) ? 'soft' : 'subtle'" :key="message.id"
            :side="isMessageFromUser(message, user?.id!) ? 'left' : 'right'" role="user" :parts="[
              {
                text: message.content,
              },
            ]" :id="String(message.id)" :ui="{
              container: 'pb-1',
              content: 'min-w-60' + (isMessageFromUser(message, user?.id!) ? ' bg-secondary/90 text-(--monochrome-900)/70' : ' bg-primary/100 text-(--monochrome-600)'),
            }">
            <template #content>
              <p class="body-xs italic pb-1">{{ formatMessageTimestamp(message.createdAt) }}</p>
              <p
                :class="['body-sm break-all whitespace-pre-wrap', isMessageFromUser(message, user?.id!) ? 'text-(--monochrome-900)' : 'text-(--monochrome-900)']">
                {{ message.content }}
              </p>
              <div class="flex mt-1 items-center gap-1">
                <UAvatar :src="message.sender.avatar || undefined" :alt="message.sender.username!" class="text-(--foreground-100)" :ui="{ root: message.sender.avatar ? 'bg-transparent' : 'bg-(--background-200)' }"
                  size="lg" />
                <p class="body-xs italic py-1">{{ getConvoMessagePoV(message, user?.id!) }}</p>
              </div>
            </template>
          </UChatMessage>
        </UChatMessages>
      </div>
    </template>
    <template #footer>
      <UInput :ui="{
        root: 'body-sm w-full',
        base: 'bg-background/50! outline-0!',
        trailingIcon: 'text-secondary',
      }" placeholder="Type your message..." trailing variant="none" v-model="messageContent" autofocus
        @keydown.enter.prevent="handleSendMessage">
        <template #trailing>
          <UButton icon="i-lucide-send" variant="ghost" size="sm" :disabled="messageContent.trim().length === 0"
            @click="handleSendMessage" :ui="{
              leadingIcon: 'text-secondary',
            }" />
        </template>
      </UInput>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import type { User } from "#auth-utils";

/**
 * Composables
 */
const { sendReply, markMessageAsRead, activeEnquiry } = useEnquiries();
const { markAsRead } = useNotifications();
const { setAvailabilityStatus } = useMyListings();
const toast = useToast();
const breakpoints = useBreakpoints(breakpointsTailwind);
const activeBreakpoints = breakpoints.active();

/**
 * Props & Emits
 */
const props = defineProps<{
  open: boolean;
  conversation: ConversationWithMinimalListing | null;
  user: User | null;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

/**
 * Component State
 */
const messageContent = ref("");
const chatContainer = ref<HTMLElement | null>(null);
const localMessages = ref<any[]>([]);
const processedMessageIds = new Set<number>();
const isMarkingAsRead = ref(false);
const isUpdatingEnquiryStatus = ref(false);

// Mirror availability status locally so the select is reactive
const enquiryAvailabilityStatus = ref<string>(
  props.conversation?.listing?.saleListing?.availabilityStatus ??
  props.conversation?.listing?.rentalListing?.availabilityStatus ??
  'AVAILABLE'
);

/**
 * Computed Properties
 */
const isOpen = usePropModel(props, "open", emit);

// True when the current user owns the listing in this conversation
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
  return !activeBreakpoints.value.includes("md") && !activeBreakpoints.value.includes("lg") && !activeBreakpoints.value.includes("xl") && !activeBreakpoints.value.includes("2xl");
});

const otherUser = computed(() => {
  if (!props.conversation || !props.user?.id) return null;
  return props.conversation.sender?.id === props.user.id ? props.conversation.receiver : props.conversation.sender;
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

/**
 * Methods
 */
function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
}

async function handleEnquiryAvailabilityChange(value: string | number | boolean | null) {
  const listingId = props.conversation?.listing?.id;
  if (!listingId || !value || typeof value !== 'string') return;
  isUpdatingEnquiryStatus.value = true;
  const previous = enquiryAvailabilityStatus.value;
  try {
    await setAvailabilityStatus(listingId, value as AvailabilityOptions);
    toast.add({
      title: 'Status updated',
      description: enquiryAvailabilityItems.value.find((i) => i.value === value)?.label ?? value,
      color: 'success',
      icon: 'i-lucide-check-circle',
    });
  } catch {
    enquiryAvailabilityStatus.value = previous;
    toast.add({ title: 'Error', description: 'Failed to update listing status', color: 'error', icon: 'i-lucide-circle-x' });
  } finally {
    isUpdatingEnquiryStatus.value = false;
  }
}

async function handleSendMessage() {
  if (!messageContent.value.trim() || !props.conversation?.id) return;

  try {
    await sendReply(props.conversation.id, messageContent.value);
    messageContent.value = "";
  } catch (e) {
    console.error("Failed to send message", e);
  }
}

async function markMessagesAsRead() {
  if (!props.conversation?.messages || !props.conversation?.id || !props.user?.id) return;
  if (isMarkingAsRead.value) {
    return;
  }

  const unreadMessages = props.conversation.messages.filter((message: any) => !message.isRead && message.receiverId === props.user!.id);

  if (unreadMessages.length === 0) return;

  isMarkingAsRead.value = true;
  try {
    // Mark notifications for this conversation as read
    // Pass exact count of unread messages so aggregates decrement correctly
    await markAsRead({ conversationId: props.conversation.id, unreadMessageCount: unreadMessages.length });

    // Mark individual messages as read
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
      })
    );
  } finally {
    isMarkingAsRead.value = false;
  }
}

/**
 * Watchers
 */

// Sync local messages with activeEnquiry from useEnquiries (WebSocket updates will flow through here)
watch(
  () => activeEnquiry.value?.messages,
  (newMessages) => {
    if (newMessages && props.open) {
      localMessages.value = [...newMessages];
      scrollToBottom();
      markMessagesAsRead();
    }
  },
  { deep: true }
);

// Initialize view when modal opens
watch(
  () => props.open,
  (newVal) => {
    if (newVal && props.conversation?.messages) {
      processedMessageIds.clear();
      localMessages.value = [...props.conversation.messages];
      scrollToBottom();
      markMessagesAsRead();
    }
  },
  { immediate: true }
);

// Watch for prop updates (in case conversation is updated externally)
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
  { deep: true }
);
</script>
