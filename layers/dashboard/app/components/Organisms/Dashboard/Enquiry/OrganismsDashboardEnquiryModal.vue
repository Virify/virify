<template>
  <UModal
    v-model:open="isOpen"
    description="Enquiry Details"
    :fullscreen="isMobile"
    :ui="{
      overlay: 'bg-black/50 backdrop-blur-sm',
      content: 'max-w-[1300px] w-full sm:w-[90vw]',
      description: 'pl-10 body-sm',
      body: 'py-6 px-0!',
    }"
  >
    <template #title>
      <div class="flex items-center gap-3">
        <UAvatar :alt="otherUser?.username!" :name="otherUser?.username!" size="sm" class="bg-(--background-300)" />
        <div class="flex flex-col gap-1 flex-wrap">
          <h2 class="text-sm font-bold leading-none">{{ otherUser?.username || "Unknown User" }}</h2>
          <p class="text-xs text-(--foreground-200)/80 truncate mt-1 font-normal">
            {{ subTitle }}
          </p>
        </div>
      </div>
    </template>
    <template #body>
      <div ref="chatContainer" class="overflow-y-auto px-4 scroll-smooth" :class="isMobile ? 'h-full' : 'h-[60vh]'">
        <UChatMessages should-auto-scroll>
          <UChatMessage
            v-for="message in localMessages"
            :variant="isMessageFromUser(message, user?.id!) ? 'soft' : 'subtle'"
            :key="message.id"
            :side="isMessageFromUser(message, user?.id!) ? 'left' : 'right'"
            role="user"
            :parts="[
              {
                text: message.content,
              },
            ]"
            :id="String(message.id)"
            :ui="{
              container: 'pb-1',
              content: 'min-w-60' + (isMessageFromUser(message, user?.id!) ? ' bg-secondary/90 text-(--monochrome-900)/70' : ' bg-primary/100 text-(--monochrome-600)'),
            }"
          >
            <template #content>
              <p class="body-xs italic pb-1">{{ formatMessageTimestamp(message.createdAt) }}</p>
              <p :class="['body-sm break-all whitespace-pre-wrap', isMessageFromUser(message, user?.id!) ? 'text-(--monochrome-900)' : 'text-(--monochrome-900)']">
                {{ message.content }}
              </p>
              <div class="flex mt-1 items-center gap-1">
                <UAvatar :alt="message.sender.username!" class="text-(--foreground-100) bg-(--background-100)" size="xs" />
                <p class="body-xs italic py-1">{{ getConvoMessagePoV(message, user?.id!) }}</p>
              </div>
            </template>
          </UChatMessage>
        </UChatMessages>
      </div>
    </template>
    <template #footer>
      <UInput
        :ui="{
          root: 'body-sm w-full',
          base: 'bg-background/50! outline-0!',
          trailingIcon: 'text-secondary',
        }"
        placeholder="Type your message..."
        trailing
        variant="none"
        v-model="messageContent"
        autofocus
        @keydown.enter.prevent="handleSendMessage"
      >
        <template #trailing>
          <UButton
            icon="i-lucide-send"
            variant="ghost"
            size="sm"
            :disabled="messageContent.trim().length === 0"
            @click="handleSendMessage"
            :ui="{
              leadingIcon: 'text-secondary',
            }"
          />
        </template>
      </UInput>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import type { User } from "#auth-utils";

/**
 * Application Composables
 */
const { sendReply, markMessageAsRead } = useConversations();
const { aggregates, removeUnreadMessagesForConversation, activeConversationId } = useNotifications();
const breakpoints = useBreakpoints(breakpointsTailwind);
const activeBreakpoints = breakpoints.active();

/**
 * Props & Emits
 */
const props = defineProps<{
  open: boolean;
  conversation: ConversationWithUserAndMessages;
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

/**
 * Computed Properties
 */
const isOpen = usePropModel(props, "open", emit);

/**
 * Determines if the current viewport is mobile size
 */
const isMobile = computed(() => {
  return !activeBreakpoints.value.includes("md") && !activeBreakpoints.value.includes("lg") && !activeBreakpoints.value.includes("xl") && !activeBreakpoints.value.includes("2xl");
});

const otherUser = computed(() => {
  if (!props.conversation || !props.user?.id) return null;
  return props.conversation.sender?.id === props.user.id ? props.conversation.receiver : props.conversation.sender;
});

const subTitle = computed(() => {
  const listing = props.conversation.listing;
  if (!listing?.property?.address) return "Address not provided";

  const { street, city, postcode, fullAddress } = listing.property.address;
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
 * Scrolls the chat container to the bottom
 */
function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
}

/**
 * Sends a reply message to the current conversation
 */
async function handleSendMessage() {
  if (!messageContent.value.trim() || !props.conversation?.id) return;

  try {
    // Send the message - we rely on the WebSocket event to add it to the UI
    // This prevents duplication and ensures the server received it
    await sendReply(props.conversation.id, messageContent.value);
    messageContent.value = "";
  } catch (e) {
    console.error("Failed to send message", e);
  }
}

/**
 * Marks all unread messages from the other user as read
 */
async function markMessagesAsRead() {
  if (!props.conversation?.messages || !props.conversation?.id || !props.user?.id) return;

  // Using any for message temporarily as message types might be loose
  const unreadMessages = props.conversation.messages.filter((message: any) => !message.isRead && message.receiverId === props.user!.id);

  if (unreadMessages.length === 0) return;

  // Optimistically decrement unreadConversations since we're marking all messages as read
  if (aggregates.value.unreadConversations > 0) {
    aggregates.value.unreadConversations--;
  }

  // Remove messages from the global notification list
  removeUnreadMessagesForConversation(props.conversation.id);

  // Process all mark-as-read operations
  // Backend will send unreadMessages decrements via WebSocket
  // processedMessages tracks IDs we've already attempted to mark to prevent 429 loops
  const messagesToMark = unreadMessages.filter((m: any) => !processedMessageIds.has(m.id));
  
  if (messagesToMark.length === 0) return;

  messagesToMark.forEach((m: any) => processedMessageIds.add(m.id));

  await Promise.all(
    messagesToMark.map(async (message: any) => {
      try {
        await markMessageAsRead(message.id, props.conversation.id);
      } catch (e) {
        console.error(`Failed to mark message ${message.id} as read`, e);
        // If failed, remove from processed so we can try again next time
        processedMessageIds.delete(message.id);
      }
    })
  );
}

const processedMessageIds = new Set<number>();

/**
 * Watchers
 */

// Sync global active conversation ID
watch(
  [() => props.open, () => props.conversation?.id],
  ([isOpen, convId]) => {
    if (isOpen && convId) {
      activeConversationId.value = convId;
    } else if (!isOpen && activeConversationId.value === convId) {
        // Only clear if WE set it (it matches our ID)
      activeConversationId.value = null;
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  if (activeConversationId.value === props.conversation?.id) {
    activeConversationId.value = null;
  }
});

// Scroll to bottom when new messages arrive
watch(
  () => localMessages.value.length,
  () => {
    scrollToBottom();
  }
);

// Initialize view when modal opens
watch(
  () => props.open,
  (newVal) => {
    if (newVal) {
      // Hydrate local messages from prop
      if (props.conversation?.messages) {
        localMessages.value = [...props.conversation.messages];
      }

      scrollToBottom();

      // Force removal if conversation is open (state update might be slow)
      if (props.conversation?.id) {
        removeUnreadMessagesForConversation(props.conversation.id);
      }

      markMessagesAsRead();
    }
  },
  { immediate: true }
);

// Watch for connection/prop updates
watch(
  () => props.conversation,
  (newVal) => {
    if (newVal?.messages) {
      localMessages.value = [...newVal.messages];
      scrollToBottom();
      // If conversation updates (new messages) while open, mark them as read
      if (props.open) {
        markMessagesAsRead();
      }
    }
  },
  { deep: true }
);

// Listen for incoming messages on this conversation
import { useWebSocket } from "@vueuse/core";
const config = useRuntimeConfig();

const { data: wsData } = useWebSocket(config.public.WS_BASE_URL + "/api/_ws/connection", {
  autoReconnect: true,
});

watch(wsData, (newData) => {
  try {
    if (newData && typeof newData === "string") {
      const parsed = JSON.parse(newData);
      if (parsed.type === "new_message" && Number(parsed.conversationId) === Number(props.conversation?.id)) {
        // Ensure IDs are compared as numbers to avoid type mismatch duplicates
        // And ignore if we somehow already have it
        const newMsgId = Number(parsed.message.id);
        if (!localMessages.value.some((m) => Number(m.id) === newMsgId)) {
          localMessages.value.push(parsed.message);
          scrollToBottom();
        }
      }
    }
  } catch (e) {
    // ignore parse errors
  }
});
</script>
