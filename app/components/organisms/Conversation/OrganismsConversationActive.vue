<template>
  <div class="conversation-overlay" :class="{ open: isOpen }" @click="$emit('back')">
    <aside class="conversation-detail" @click.stop>
      <div class="conversation-header">
        <h3 class="conversation-title | title-xs">{{ conversation?.sender?.username }}</h3>
        <button class="close-btn" @click="$emit('back')">
          <AtomsIcon icon="cross" size="24" />
        </button>
      </div>

      <div class="conversation-content-scrollable" ref="scrollableRef">
        <MoleculesConversationListingCard :conversation="conversation" />
        <MoleculesConversationMessageList :messages="conversation?.messages || []" :current-user-id="currentUserId" />
      </div>

      <MoleculesConversationReplyInput v-if="conversation" @send="sendReply" />
      
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

// Conversation management
const conversationState = useConversationState();
const conversationActions = useConversationActions(conversationState);
const conversationEvents = useConversationEvents(conversationState);

// Reply logic
const sending = ref(false)
const scrollableRef = ref<HTMLDivElement | null>(null)


onMounted(() => {
  scrollToBottomInternal();
  // Mark messages as read when component mounts and conversation is open
  if (props.isOpen && props.conversation) {
    markUnreadMessagesAsRead();
  }
});

// Simple watcher just for scrolling when messages change
watch(() => props.conversation?.messages?.length, scrollToBottomInternal);

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

function scrollToBottomInternal() {
  nextTick(() => {
    scrollToBottom(scrollableRef.value)
  })
}

async function sendReply(message: string) {
  if (!props.conversation || !message.trim() || sending.value) return

  const content = message.trim()
  const conversationId = props.conversation.id
  sending.value = true

  try {
    await conversationActions.sendReply(conversationId, content)
  } catch (e) {
    console.error('Failed to send reply', e)
  } finally {
    sending.value = false
  }
}
</script>

<style lang="scss" scoped>
@use '#styles/_utils/media' as mq;

.conversation-overlay {
  width: 100%;
  height: 100%;

  @media (max-width: 768px) {
    position: fixed;
    top: var(--header-offset);
    left: 0;
    bottom: var(--mobile-nav-height);
    height: calc(100dvh - var(--header-offset) - var(--mobile-nav-height));
    width: 100vw;
    background: rgba(0, 0, 0, 0.5);
    z-index: 40;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    
    &.open {
      opacity: 1;
      visibility: visible;
    }
  }
}

.conversation-detail {
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
    bottom: 0;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    border-radius: 0;
    padding-bottom: var(--mobile-nav-height);
    
    .open & {
      transform: translateX(0);
    }
  }
}

.conversation-header {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--size-16);
  border-bottom: 1px solid var(--border-100);
  background: var(--background-200);

  .conversation-title {
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

.conversation-content-scrollable {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  min-height: 0;
  height: 0;
  position: relative;
  overscroll-behavior: contain;
  touch-action: pan-y;
  padding: var(--size-16);
}



.reply-section {
  flex-shrink: 0;
  background: var(--background-200);
  border-top: 1px solid var(--border-100);

  
  @include mq.mobile-only {
    padding: 16px;
    padding-bottom: calc(var(--size-16) + env(safe-area-inset-bottom));
  }

  .reply-input-container {
    position: relative;
    display: flex;
    align-items: center;
  }
}

.mobile-nav-overlay {
  @media (max-width: 768px) {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1004;
  }
  
  @media (min-width: 769px) {
    display: none;
  }
}
</style>
