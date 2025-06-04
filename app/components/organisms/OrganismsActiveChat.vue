<template>
  <div class="o-active-chat-panel">
    <div v-if="conversation" class="o-messages-panel-content">
      <ul ref="messagesListRef" class="o-messages-list">
        <div v-if="conversation.listing" class="o-conversation-header">
          <NuxtLink
            :to="`/listing/${conversation.listing.id}`"
            class="o-conversation-link | body-sm"
            target="_blank"
            >
            <h2 class="| title-xs">Enquiry: {{ conversation.listing?.property?.address?.fullAddress || 'No address provided' }}</h2>
          </NuxtLink>
          <div class="o-conversation-price-type">
            <p class="title-xs">{{ formattedPrice }}</p>
            <p class="body-xs">{{ convertEnumToString(priceType) }}</p>
          </div>
        </div>
        <MoleculesMessageBubble
          v-for="(message) in conversation.messages"
          :key="message.id"
          :message="message"
          :current-user-id="currentUserId"
        />
      </ul>
      <div v-if="isTyping" class="o-typing-indicator | body-sm">
        <p>typing...</p>
      </div>
      <div class="o-reply-bar-container">
        <input
          type="text"
          :value="replyMessage"
          @input="handleInput"
          @keydown.enter="$emit('send-reply')"
          class="o-message-input"
          placeholder="Reply..."
        />
        <button
          @click="$emit('send-reply')"
          :disabled="isSendDisabled || !replyMessage.trim()"
          class="| button"
        >
          Reply
        </button>
      </div>
    </div>
    <div v-else class="o-messages-panel-placeholder">
      <p class="body-lg">Select a conversation to view messages.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ConversationWithUserAndMessages } from '~~/shared/types/conversation';

interface Props {
  conversation: ConversationWithUserAndMessages | null;
  currentUserId?: string | number;
  replyMessage: string;
  isSendDisabled: boolean;
  isTyping?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits(['update:replyMessage', 'send-reply', 'user-typing']);
const messagesListRef = ref<HTMLUListElement | null>(null);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:replyMessage', target.value);
  emit('user-typing');
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesListRef.value) {
      messagesListRef.value.scrollTop = messagesListRef.value.scrollHeight;
    }
  });
};

const priceType = computed(() => {
  return props.conversation?.listing?.saleListing?.priceType ?? props.conversation?.listing?.rentalListing?.rentFrequency;
});

const formattedPrice = computed(() => {
  return `£${parseInt(String(props.conversation?.listing?.price)).toLocaleString()}`
});

watch(() => props.conversation, (newConversation) => {
  if (newConversation) {
    scrollToBottom();
  }
}, { deep: true });

watch(() => props.conversation?.messages, () => {
  if (props.conversation) {
    scrollToBottom();
  }
}, { deep: true });

// Expose scrollToBottom for parent component if needed, though internal watches should handle most cases.
defineExpose({ scrollToBottom });

</script>

<style lang="scss" scoped>
.o-active-chat-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--background-100);
  border-radius: var(--border-radius-lg);
}

.o-messages-panel-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden; 
  padding: 0 16px;
}

.o-conversation-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  .o-conversation-price-type {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
}

.o-messages-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  flex-grow: 1; 
  overflow-y: auto; 
  padding-right: 8px;
}

.o-typing-indicator {
  padding: 0.5rem 1rem;
  color: var(--foreground-500);
  text-align: left;
  height: 2.5rem;
}

.o-reply-bar-container {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
  padding-top: 0.5rem;
  padding-bottom: 1rem; 
  border-top: 1px solid var(--background-200);
}

.o-message-input {
  flex-grow: 1;
  padding: 8px 12px; 
  border-radius: var(--border-radius-md);
  border: 1px solid var(--foreground-200);
  background-color: var(--background-input);
  color: var(--foreground-100);

  &:focus {
    outline: none;
    border-color: var(--primary-300);
    box-shadow: 0 0 0 2px var(--primary-focus-ring);
  }
}

.o-messages-panel-placeholder {
  display: flex;
  align-items: start;
  justify-content: center;
  height: 200px;
  padding: 32px;
  text-align: center;
  background-color: var(--background-100);
}
</style>
