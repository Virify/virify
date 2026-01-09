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
            :parts="[
              {
                text: message.content,
              },
            ]"
            :id="message.id"
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

const props = defineProps<{
  open: boolean
  conversation: any // ConversationWithUserAndMessages
  user: any
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const isOpen = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val)
})

const { sendReply, markMessageAsRead } = useConversations();
const messageContent = ref("");
const chatContainer = ref<HTMLElement | null>(null);

const breakpoints = useBreakpoints(breakpointsTailwind);
const activeBreakpoints = breakpoints.active();

const isMobile = computed(() => {
  return !activeBreakpoints.value.includes("md") && !activeBreakpoints.value.includes("lg") && !activeBreakpoints.value.includes("xl") && !activeBreakpoints.value.includes("2xl");
});

const messages = computed(() => {
  return props.conversation?.messages || [];
});

function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
}

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

watch(
  () => messages.value.length,
  () => {
    scrollToBottom();
  }
);

// Scroll to bottom when opening
watch(
  () => props.open,
  (newVal) => {
    if (newVal) {
      scrollToBottom();
      markMessagesAsRead();
    }
  }
)

function markMessagesAsRead() {
  if (!props.conversation?.messages || !props.conversation?.id || !props.user?.id) return;
  
  const unreadMessages = props.conversation.messages.filter(
    (message: any) => !message.isRead && message.receiverId === props.user.id
  );

  unreadMessages.forEach(async (message: any) => {
    try {
      await markMessageAsRead(message.id, props.conversation.id);
    } catch (e) {
      console.error(`Failed to mark message ${message.id} as read`, e);
    }
  });
}
</script>