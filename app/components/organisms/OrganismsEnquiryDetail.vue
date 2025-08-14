<template>
  <div class="enquiry-overlay" :class="{ open: isOpen }" @click="$emit('back')">
    <aside class="enquiry-detail" @click.stop>
      <div class="enquiry-header">
        <h3 class="enquiry-title | title-xs">{{ conversation?.sender?.username }}</h3>
        <button class="close-btn" @click="$emit('back')">
          <AtomsIcon icon="cross" size="24" />
        </button>
      </div>

      <div class="enquiry-content-scrollable" ref="scrollableRef">
        <div v-if="conversation && conversation.listing" class="property-header">
          <div class="property-image" v-if="firstImage">
            <NuxtImg 
              :src="firstImage" 
              alt="Property image" 
              width="268" 
              height="100"
              loading="eager"
              sizes="268px"
              format="webp,jpg"
              quality="80"
              placeholder="/img/preload.svg"
            />
            <div class="property-badge | body-sm font-semibold">Your Property</div>
          </div>
          <div class="property-details">
            <div class="property-info">
              <h3 class="property-price | title-sm">{{ priceFormatted }}</h3>
              <p class="property-address| body-xs">{{ address }}</p>
            </div>
            <div class="agent-info">
              <div class="agent-avatar">
                <AtomsIcon icon="profile" size="28" />
              </div>
              <span class="agent-name | body-sm">{{ conversation.sender?.username }}</span>
            </div>
          </div>
        </div>
        <div v-else class="property-header property-header--empty">
          <p class="body-xs">No listing details available.</p>
        </div>

        <div class="enquiry-messages">
          <ul class="messages-list">
            <li v-for="message in conversation?.messages" :key="message.id" class="message-item"
              :class="{ 'from-me': message.senderId === currentUserId }">
              <p class="message-content | body-sm">{{ message.content }}</p>
              <div class="message-status">
                <span class="message-time | body-xs">{{ formatMessageTimestamp(message.createdAt) }}</span>
                <div v-if="message.senderId === currentUserId" class="message-read-status">
                  <AtomsIcon :icon="message.isRead ? 'account/read' : 'account/sent'" size="12" />
                  <span class="status-text | body-xs">{{ message.isRead ? 'Read' : 'Sent' }}</span>
                </div>
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

const listing = computed(() => props.conversation?.listing)
const property = computed(() => listing.value?.property)

const firstImage = computed(() => {
  const media = property.value?.media
  if (!Array.isArray(media)) return null
  return media.find(m => m.image)?.image
})
const address = computed(() => property.value?.address?.fullAddress || "Address not provided")

const priceFormatted = computed(() => {
  const price = listing.value?.price
  if (!price) return ""
  return `£${parseInt(String(price)).toLocaleString()}`
})


// Conversation management
const conversationState = useConversationState();
const conversationActions = useConversationActions(conversationState);
const conversationEvents = useConversationEvents(conversationState);

// Reply logic
const replyMessage = ref("")
const sending = ref(false)
const scrollableRef = ref<HTMLDivElement | null>(null)


watchEffect(() => {
  if (import.meta.client && props.isOpen && window.innerWidth <= 768) {
    document.documentElement.style.overflow = 'hidden'
  } else if (import.meta.client) {
    document.documentElement.style.overflow = ''
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    document.documentElement.style.overflow = ''
  }
})

onMounted(() => {
  scrollToBottom();
  // Mark messages as read when component mounts and conversation is open
  if (props.isOpen && props.conversation) {
    markUnreadMessagesAsRead();
  }
});

// Simple watcher just for scrolling when messages change
watch(() => props.conversation?.messages?.length, scrollToBottom);

// Mark messages as read ONLY when conversation opens (not when new messages arrive)
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.conversation) {
    markUnreadMessagesAsRead();
  }
});

/**
 * Mark all unread messages in the current conversation as read
 * Only marks messages that were sent TO the current user (not from them)
 */
function markUnreadMessagesAsRead() {
  if (!props.conversation || !props.currentUserId) return;
  
  const unreadMessages = props.conversation.messages.filter(
    message => !message.isRead && message.senderId !== props.currentUserId
  );
  
  // Mark each unread message as read
  unreadMessages.forEach(message => {
    conversationEvents.markMessageAsRead(message.id, props.conversation!.id);
  });
}

function scrollToBottom() {
  nextTick(() => {
    if (scrollableRef.value) {
      scrollableRef.value.scrollTop = scrollableRef.value.scrollHeight
    }
  })
}

async function sendReply() {
  if (!props.conversation || !replyMessage.value.trim() || sending.value) return

  const content = replyMessage.value.trim()
  const conversationId = props.conversation.id
  replyMessage.value = ""
  sending.value = true

  try {
    await conversationActions.sendReply(conversationId, content)
  } catch (e) {
    replyMessage.value = content
    console.error('Failed to send reply', e)
  } finally {
    sending.value = false
  }
}
</script>

<style lang="scss" scoped>
.enquiry-overlay {
  width: 100%;
  height: 100%;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1002;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    
    &.open {
      opacity: 1;
      visibility: visible;
    }
  }
}

.enquiry-detail {
  width: 100%;
  height: 100%;
  background: var(--background-200);
  display: flex;
  flex-direction: column;
  touch-action: manipulation;
  overflow: hidden;
  border-radius: var(--border-radius-xl);

  @media (max-width: 768px) {
    position: absolute;
    top: 0;
    right: 0;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    border-radius: 0;
    
    .open & {
      transform: translateX(0);
    }
  }
}

.enquiry-header {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--size-16);
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
  padding: 0;

  .messages-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--size-12);
  }

  .message-item {
    background: var(--primary-600);
    padding: var(--size-12) var(--size-16);
    border-radius: var(--border-radius-lg);
    border-bottom-left-radius: 0;
    max-width: 280px;
    align-self: flex-start;
    position: relative;

    &.from-me {
      background: var(--secondary-500);
      color: var(--foreground-100);
      align-self: flex-end;
      border-bottom-left-radius: var(--border-radius-lg);
      border-bottom-right-radius: 0;
    }

    .message-content {
      margin: 0 0 var(--size-8) 0;
      color: var(--monochrome-100);
    }

    .message-status {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--size-8);
      color: var(--monochrome-400);

      .message-time {
        color: var(--monochrome-400);
        flex-shrink: 0;
      }

      .message-read-status {
        display: flex;
        align-items: center;
        gap: var(--size-4);
      }
    }
  }
}

.reply-section {
  flex-shrink: 0;
  background: var(--background-200);
  border-top: 1px solid var(--border-100);
  padding: var(--size-16);
  
  @media (max-width: 768px) {
    padding-bottom: calc(var(--size-16) + 90px + env(safe-area-inset-bottom));
  }

  .reply-input-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .reply-input {
    width: 100%;
    padding: var(--size-8);
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
