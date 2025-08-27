<template>
  <div class="conversation-overlay" :class="{ open: isOpen }" @click="$emit('back')">
    <aside class="conversation-detail" @click.stop>
      <div class="conversation-header">
        <h3 class="conversation-title | title-xs">{{ formattedPartnerName }}</h3>
        <button class="close-btn" @click="$emit('back')">
          <AtomsIcon icon="cross" size="24" />
        </button>
      </div>

      <!-- Mobile: Listing card acts as the title/header content (non-scrolling) -->
      <div class="conversation-listing-header">
        <MoleculesConversationListingCard :conversation="conversation" />
      </div>

      <div class="conversation-content-scrollable" ref="scrollableRef">
        <MoleculesConversationMessageList :messages="conversation?.messages || []" :current-user-id="currentUserId" />
      </div>

      <MoleculesConversationReplyInput v-if="conversation" @send="sendReply" />
      
    </aside>
  </div>
</template>

<script setup lang="ts">

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
const marking = ref(false)

// Partner name computation
const conversationPartnerName = computed(() => {
  if (!props.conversation) return '';
  const pov = getConversationPoV(props.conversation, props.currentUserId as number);
  return pov.name;
});

const formattedPartnerName = computed(() => {
  const name = conversationPartnerName.value;
  return typeof name === "string" ? formatPartnerName(name) : name;
});


onMounted(() => {
  scrollToBottomInternal();
});

// Watch for message list length changes: scroll, and if conversation is open mark incoming messages as read
// Combined watcher: handles conversation open (mark all unread) and new incoming messages (mark newly-added unread)
watch([
  () => props.isOpen,
  () => props.conversation?.messages?.length,
], ([isOpen, newLen], [oldIsOpen, oldLen]) => {
  // Always ensure we scroll when messages change or conversation opens
  scrollToBottomInternal();

  // If conversation just opened, mark all unread messages
  if (isOpen && !oldIsOpen && props.conversation) {
    if (marking.value) return;
    marking.value = true;

    const unreadMessages = props.conversation.messages.filter(
      (m: any) => !m.isRead && m.senderId !== props.currentUserId
    );

    unreadMessages.forEach(m => conversationEvents.markMessageAsRead(m.id, props.conversation!.id));

    nextTick(() => { marking.value = false });
  }

  // If new messages were appended while conversation is open, mark the newly added unread ones
  if (isOpen && props.conversation && oldLen && newLen && newLen > oldLen) {
    const newMessages: MessageWithUser[] = getNewUnreadMessagesFromOthers(props.conversation, oldLen, newLen, props.currentUserId)
    if (!newMessages.length) return

    if (marking.value) return
    marking.value = true

    newMessages.forEach(message => {
      conversationEvents.markMessageAsRead(message.id, props.conversation!.id);
    })

    nextTick(() => { marking.value = false })
  }
});

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

@include mq.mobile-only {
    max-height: calc(100dvh - var(--header-offset) - env(safe-area-inset-bottom, 0px));
    position: fixed;
    top: var(--header-offset);
    bottom: 0;
    left: 0;
    padding-bottom: env(safe-area-inset-bottom);
    width: 100vw;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
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
  background: var(--background-200);
  display: flex;
  flex-direction: column;
  touch-action: manipulation;
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

.conversation-listing-header {
  flex-shrink: 0;
  background: var(--background-200);
  border-bottom: 1px solid var(--border-100);
  padding: 0 var(--size-16) var(--size-8);

  @include mq.mobile-only {
    position: sticky;
    top: 0;
    z-index: 1;
  }
}

.conversation-content-scrollable {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;
  overscroll-behavior: contain;
  touch-action: pan-y;
  padding: 0 var(--size-16);
}

.reply-section {
  flex-shrink: 0;
  background: var(--background-200);
  border-top: 1px solid var(--border-100);

  
  @include mq.mobile-only {
    padding: 16px;
  }

  .reply-input-container {
    position: relative;
    display: flex;
    align-items: center;
  }
}
</style>
