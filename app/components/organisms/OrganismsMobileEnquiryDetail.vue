<template>
  <!-- Secondary Overlay for Selected Enquiry -->
  <div class="mobile-enquiry-overlay" :class="{ open: isOpen }" @click="$emit('back')">
    <aside class="mobile-enquiry-detail" @click.stop>
      <div class="mobile-enquiry-header">
        <h3 class="enquiry-title | title-md">{{ conversation?.sender?.username }}</h3>
        <button class="close-btn" @click="$emit('back')">
          <AtomsIcon icon="cross" size="24" />
        </button>
      </div>

      <div class="enquiry-content-scrollable">
        <div v-if="conversation && conversation.listing" class="property-header">
          <div class="property-image" v-if="firstImage">
            <img :src="firstImage" alt="Property image" />
            <div class="property-badge | body-sm font-semibold">Your Property</div>
          </div>
          <div class="property-details">
            <div class="property-info">
              <h3 class="property-price | title-sm">{{ priceFormatted }}</h3>
              <p class="property-address| body-sm">{{ address }}</p>
            </div>
            <div class="agent-info">
              <div class="agent-avatar">
                <AtomsIcon icon="profile" size="28" />
              </div>
              <span class="agent-name | body-sm">MaggotBalls</span>
            </div>
          </div>
        </div>
        <div v-else class="property-header property-header--empty">
          <p class="body-xs">No listing details available.</p>
        </div>

        <div class="enquiry-messages">
          <ul class="messages-list" ref="messagesListRef">
            <li v-for="message in conversation?.messages" :key="message.id" class="message-item"
              :class="{ 'from-me': message.senderId === currentUserId }">
              <p class="message-content | body-sm">{{ message.content }}</p>
              <div class="message-status">
                <AtomsIcon :icon="message.isRead ? 'account/read' : 'account/sent'" size="12" />
                <span class="status-text | body-xs">{{ message.isRead ? 'Read' : 'Sent' }}</span>
              </div>
            </li>
          </ul>
        </div>

      </div>

      <div class="reply-section" v-if="conversation">
        <div class="reply-input-container">
          <input v-model="replyMessage" type="text" class="reply-input | body-sm" placeholder="Message..."
            @keydown.enter.prevent="sendReply" />
          <button class="send-btn" :disabled="!replyMessage.trim() || sending" @click="sendReply">
            <AtomsIcon v-if="!sending" icon="ai/send" size="20" />
            <span v-else class="loading-text">...</span>
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import type { ConversationWithUserAndMessages } from "~~/shared/types/conversation";

const props = defineProps<{
  isOpen: boolean;
  conversation: ConversationWithUserAndMessages | null;
  currentUserId?: number | string | null;
}>();

defineEmits<{ back: [] }>();

const conversation = computed(() => props.conversation);
const listing = computed(() => props.conversation?.listing);
const property = computed(() => listing.value?.property);

const images = computed(() => {
  const media = property.value?.media;
  if (!Array.isArray(media)) return [];
  return media.filter(m => m.image).map(m => m.image!);
});

const firstImage = computed(() => images.value[0]);

const address = computed(() => property.value?.address?.fullAddress || "Address not provided");

const priceFormatted = computed(() => {
  const price = listing.value?.price;
  if (!price) return "";
  return `£${parseInt(String(price)).toLocaleString()}`;
});

// Conversation management
const conversationState = useConversationState();
const conversationActions = useConversationActions(conversationState);

// Reply logic
const replyMessage = ref("");
const sending = ref(false);
const messagesListRef = ref<HTMLUListElement | null>(null);


// Prevent body scroll when modal is open
watchEffect(() => {
  if (import.meta.client) {
    if (props.isOpen) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
    }
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    document.documentElement.style.overflow = '';
  }
});

onMounted(() => {
  // Auto scroll when opened
  scrollToBottom();
});

watch(() => props.conversation?.messages?.length, () => {
  scrollToBottom();
});

function scrollToBottom() {
  nextTick(() => {
    const el = messagesListRef.value || document.querySelector('.messages-list');
    if (el) { (el as HTMLElement).scrollTop = (el as HTMLElement).scrollHeight; }
  });
}

async function sendReply() {
  if (!props.conversation || !replyMessage.value.trim() || sending.value) return;

  const content = replyMessage.value.trim();
  const conversationId = props.conversation.id;
  replyMessage.value = "";
  sending.value = true;

  try {
    await conversationActions.sendReply(conversationId, content);
    scrollToBottom();
  } catch (e) {
    // Fallback: reinsert unsent content so user can retry
    replyMessage.value = content;
    console.error('Failed to send reply', e);
  } finally {
    sending.value = false;
  }
}
</script>

<style lang="scss" scoped>
.mobile-enquiry-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1002;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  overscroll-behavior: contain;
  touch-action: manipulation;
  overflow: hidden;

  @media (max-width: 768px) {
    display: block;
  }

  &.open {
    opacity: 1;
    visibility: visible;
  }
}

.mobile-enquiry-detail {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: var(--background-200);
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  touch-action: manipulation;
  overflow: hidden;

  .open & {
    transform: translateX(0);
  }
}

.mobile-enquiry-header {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--size-20) var(--size-20) var(--size-16);
  border-bottom: 1px solid var(--border-100);
  background: var(--background-200);

  .enquiry-title {
    margin: 0;
    color: var(--foreground-100);
  }

  .close-btn {
    background: none;
    border: none;
    color: var(--foreground-100);
    cursor: pointer;
    padding: var(--size-8);
    border-radius: var(--border-radius-md);
    transition: background-color 0.2s ease;

    &:hover {
      background-color: var(--background-300);
    }

    :deep(svg) {
      display: block;
    }
  }
}

.enquiry-content-scrollable {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  min-height: 0;
  height: 0;
  position: relative;
  overscroll-behavior: contain;
  touch-action: pan-y;
  padding: 0 var(--size-16) var(--size-16) var(--size-16);
}

.property-header {
  background: var(--background-100);
  border-radius: var(--border-radius-2xl);
  margin: 0 0 var(--size-16) 0;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &--empty {
    padding: var(--size-20);
    opacity: 0.7;
    color: var(--foreground-100);
  }

  .property-image {
    position: relative;
    width: 100%;
    height: 120px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .property-badge {
    position: absolute;
    top: var(--size-8);
    left: var(--size-8);
    background: var(--secondary-400);
    color: var(--foreground-100);
    padding: var(--size-4) var(--size-8);
    border-radius: var(--border-radius-2xl);
  }

  .property-details {
    padding: var(--size-16);
    color: var(--foreground-100);
  }

  .property-info {
    margin-bottom: var(--size-12);
  }

  .property-address {
    margin: 0;
  }

  .agent-info {
    display: flex;
    align-items: center;
    gap: var(--size-8);
  }

  .agent-avatar {
    width: var(--size-32);
    height: var(--size-32);
    background: var(--background-200);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .agent-name {
    flex: 1;
  }

  .contact-btn {
    background: none;
    border: none;
    padding: var(--size-4);
    cursor: pointer;
    color: var(--foreground-100);
  }
}

.enquiry-messages {
  padding: 0; // No padding needed since container handles spacing

  .messages-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--size-12);
  }

  .message-item {
    background: var(--primary-800);
    padding: var(--size-12) var(--size-16);
    border-radius: var(--border-radius-lg);
    max-width: 280px;
    align-self: flex-start;

    &.from-me {
      background: var(--secondary-500);
      color: var(--foreground-100);
      align-self: flex-end;
    }

    .message-content {
      margin: 0 0 var(--size-8) 0;
      color: var(--monochrome-100);
    }

    .message-status {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--monochrome-400);

      .status-text {
        font-weight: 500;
      }
    }
  }
}

.reply-section {
  flex-shrink: 0;
  background: var(--background-200);
  border-top: 1px solid var(--border-100);
  padding: var(--size-16);
  padding-bottom: calc(var(--size-16) + 90px + env(safe-area-inset-bottom));

  .reply-input-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .reply-input {
    width: 100%;
    padding: var(--size-12);
    border-radius: var(--border-radius-2xl);
    border: 1px solid var(--monochrome-600);
    background: var(--background-100);
    color: var(--foreground-100);
    outline: none;

    &:focus {
      border-color: var(--secondary-400);
    }
  }

  .send-btn {
    position: absolute;
    right: var(--size-4);
    top: 50%;
    transform: translateY(-50%);
    background: var(--secondary-400);
    color: var(--foreground-100);
    border: none;
    padding: var(--size-8);
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--size-36);
    height: var(--size-36);

    &:hover:not(:disabled) {
      background: var(--secondary-500);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .loading-text {
      font-size: 12px;
      font-weight: bold;
    }
  }
}
</style>
