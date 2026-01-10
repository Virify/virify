<template>
  <UModal
    v-model:open="isOpen"
    :fullscreen="isMobile"
    :ui="{
      overlay: 'bg-black/50 backdrop-blur-sm',
      content: 'max-w-[1300px] w-full sm:w-[90vw]',
    }"
  >
    <template #title>
      <h2 class="body-sm">{{ conversation?.listing?.user?.username || "Listing Unavailable" }}</h2>
    </template>
    <template #body>
      <div ref="chatContainer" class="overflow-y-auto px-4 scroll-smooth" :class="isMobile ? 'h-full' : 'h-[60vh]'">
        <UChatMessages should-auto-scroll>
          <UChatMessage
            v-for="message in messages"
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
              content: 'text-white min-w-60' + (isMessageFromUser(message, user?.id!) ? ' bg-secondary/90' : ' bg-primary/100'),
            }"
          >
            <template #content>
              <p class="body-xs italic pb-1">{{ formatMessageTimestamp(message.createdAt) }}</p>
              <p class="body-md break-all whitespace-pre-wrap">{{ message.content }}</p>
              <div class="flex mt-1 items-center gap-1">
                <UAvatar :alt="message.sender.username!" class="text-black" size="xs" />
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
  import type { User } from '#auth-utils'

  /**
   * Application Composables
   */
  const { sendReply, markMessageAsRead } = useConversations();
  const { aggregates } = useNotifications();
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
    (e: 'update:open', value: boolean): void;
  }>();

  /**
   * Component State
   */
  const messageContent = ref("");
  const chatContainer = ref<HTMLElement | null>(null);
  
  /**
   * Computed Properties
   */
  const isOpen = usePropModel(props, 'open', emit);

  /**
   * Determines if the current viewport is mobile size
   */
  const isMobile = computed(() => {
    return !activeBreakpoints.value.includes("md") && !activeBreakpoints.value.includes("lg") && !activeBreakpoints.value.includes("xl") && !activeBreakpoints.value.includes("2xl");
  });

  /**
   * Computed list of messages from the conversation
   */
  const messages = computed(() => {
    return props.conversation?.messages || [];
  });

  /**
   * Component Methods
   */

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
      await sendReply(props.conversation.id, messageContent.value);
      messageContent.value = "";
      console.log("Message sent");
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
    const unreadMessages = props.conversation.messages.filter(
      (message: any) => !message.isRead && message.receiverId === props.user!.id
    );

    if (unreadMessages.length === 0) return;

    // Optimistically decrement unreadConversations since we're marking all messages as read
    if (aggregates.value.unreadConversations > 0) {
      aggregates.value.unreadConversations--;
    }

    // Process all mark-as-read operations
    // Backend will send unreadMessages decrements via WebSocket
    await Promise.all(unreadMessages.map(async (message: any) => {
      try {
        await markMessageAsRead(message.id, props.conversation.id);
      } catch (e) {
        console.error(`Failed to mark message ${message.id} as read`, e);
      }
    }));
  }

  /**
   * Watchers
   */

  // Scroll to bottom when new messages arrive
  watch(
    () => messages.value.length,
    () => {
      scrollToBottom();
    }
  );

  // Initialize view when modal opens
  watch(
    () => props.open,
    (newVal) => {
      if (newVal) {
        scrollToBottom();
        markMessagesAsRead();
      }
    }
  );
</script>