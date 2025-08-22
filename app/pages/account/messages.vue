<template>
  <!-- Desktop: Full messages page -->
  <div class="messages-page">
    <!-- Title and Controls Section -->
    <div class="messages-header-card">
      <h2 class="messages-title | title-md">{{ sectionTitle }}</h2>
      <div class="messages-controls">
        <div class="search-sort-row">
          <AtomsInput
            v-model="receivedSearch"
            type="text"
            placeholder="Search conversations..."
            autocomplete="off"
            class="body-sm"
          />
          <AtomsSelect 
            v-model="receivedSort" 
            :options="sortOptions"
            class="sort-select | body-sm"
          />
        </div>
      </div>
    </div>

    <!-- Messages Grid -->
    <div class="messages-grid" :class="{ 'messages-grid--has-active-conversation': selectedConversation }">
      <!-- Conversations List Section -->
      <div class="conversations-card">
        <OrganismsConversationDesktopSummary 
          :conversations="filteredReceivedConversations"
          :loading="loading"
          :active-conversation-id="selectedConversation?.id"
          :empty-message="emptyMessage"
          @select-conversation="handleConversationSelect"
        />
      </div>

      <!-- Conversation Details Section -->
      <div class="conversation-details-card">
        <div v-if="selectedConversation" class="conversation-content">
          <MoleculesConversationListingCard :conversation="selectedConversation" />
          <div class="messages-container" ref="messagesContainer">
            <MoleculesConversationMessageList 
              :messages="selectedConversation.messages || []"
              :current-user-id="user?.id"
            />
          </div>
          <MoleculesConversationReplyInput @send="handleSendReply" />
        </div>
        <div v-else class="empty-state">
          <p class="body-sm">Select a conversation to view details</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile: Chat interface as the page -->
  <div class="mobile-chat-page">
    <OrganismsConversationMobileSummary />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Messages",
  },
  layout: "account"
});

const { user } = useUserSession()
const { allConversations, loading, filterConversations } = useConversations()
const conversationState = useConversationState()
const { markMessageAsRead } = useConversationEvents(conversationState)
const conversationActions = useConversationActions(conversationState)

// Search states
const receivedSearch = ref("")

// Sort states
const receivedSort = ref("all")

// Selected conversation
const selectedConversation = ref<ConversationWithUserAndMessages | null>(null)
const messagesContainer = ref<HTMLDivElement | null>(null)
const marking = ref(false)


const sortOptions = [
  { key: "All Enquiries", value: "all" },
  { key: "Received Enquiries", value: "received" },
  { key: "Sent Enquiries", value: "sent" },
  { key: "Recent", value: "recent" },
  { key: "Oldest", value: "oldest" },
  { key: "Unread", value: "unread" },
  { key: "Read", value: "read" }
]

// Use ref instead of computed to have full control
const filteredReceivedConversations = ref<ConversationWithUserAndMessages[]>([])
const lastActiveConversationId = ref<number | null>(null)

// Function to update conversations
function updateConversationsList() {
  let conversations = allConversations.value || []
  
  // Apply search filter first
  if (receivedSearch.value.trim()) {
    conversations = filterConversations(conversations, receivedSearch.value)
  }
  
  // Apply sorting
  const sorted = sortConversations(conversations, receivedSort.value, user.value?.id)
  filteredReceivedConversations.value = sorted
}

// Combined watcher for all conversation list updates
watch([receivedSearch, receivedSort, allConversations, selectedConversation], 
  ([newSearch, newSort, newConversations, newConv], [oldSearch, oldSort, oldConversations, oldConv]) => {
    // Track active conversation ID changes
    if (newConv !== oldConv) {
      lastActiveConversationId.value = newConv?.id || null
    }
    
    // Update list when search/sort changes
    if (newSearch !== oldSearch || newSort !== oldSort) {
      updateConversationsList()
    }
    // Update list when conversations change but only if no active conversation
    else if (newConversations !== oldConversations && !selectedConversation.value) {
      updateConversationsList()
    }
  }
)

// Initial load
onMounted(() => {
  updateConversationsList()
})

// Dynamic section title based on selected filter
const sectionTitle = computed(() => {
  switch (receivedSort.value) {
    case 'received':
      return 'Received Enquiries'
    case 'sent':
      return 'Sent Enquiries'
    case 'all':
      return 'All Enquiries'
    default:
      return 'Messages'
  }
})

// Dynamic empty message based on selected filter
const emptyMessage = computed(() => {
  switch (receivedSort.value) {
    case 'received':
      return 'No received enquiries found'
    case 'sent':
      return 'No sent enquiries found'
    case 'all':
      return 'No enquiries found'
    default:
      return 'No messages found'
  }
})

function handleConversationSelect(conversation: ConversationWithUserAndMessages) {
  const previousConversation = selectedConversation.value
  
  // If we're switching between conversations, trigger re-sort first
  if (previousConversation && previousConversation.id !== conversation.id) {
    updateConversationsList()
  }
  
  // Set new active conversation
  selectedConversation.value = conversation
  // Mark unread messages as read
  markUnreadMessagesAsRead(conversation)
  // Scroll to bottom when conversation is selected
  nextTick(() => {
    scrollToBottom(messagesContainer.value)
  })
}


function markUnreadMessagesAsRead(conversation: ConversationWithUserAndMessages) {
  if (!conversation || !user.value) return
  if (marking.value) return
  marking.value = true

  const currentUserId = user.value.id
  const unreadMessages = conversation.messages.filter(
    message => !message.isRead && message.senderId !== currentUserId
  )

  // Only mark messages that are actually unread
  unreadMessages.forEach(message => {
    if (!message.isRead) {
      markMessageAsRead(message.id, conversation.id)
    }
  })

  // Allow marking again after next tick
  nextTick(() => { marking.value = false })
}

async function handleSendReply(message: string) {
  if (!selectedConversation.value || !message.trim()) return
  
  try {
    await conversationActions.sendReply(selectedConversation.value.id, message.trim())
    // Scroll to bottom after sending message
    nextTick(() => {
      scrollToBottom(messagesContainer.value)
    })
  } catch (error) {
    console.error('Failed to send reply:', error)
  }
}

// Watch for changes in messages and scroll to bottom
// Watch for changes in messages: scroll and mark incoming messages as read when conversation is active
watch(() => selectedConversation.value?.messages?.length, (newLen, oldLen) => {
  nextTick(() => {
    scrollToBottom(messagesContainer.value)
  })

  if (!selectedConversation.value || !user.value) return
  if (!oldLen || !newLen || newLen <= oldLen) return

  const newMessages: MessageWithUser[] = getNewUnreadMessagesFromOthers(selectedConversation.value, oldLen, newLen, user.value?.id)

  if (!newMessages.length) return
  if (marking.value) return
  marking.value = true

  newMessages.forEach(message => {
    markMessageAsRead(message.id, selectedConversation.value!.id)
  })

  nextTick(() => { marking.value = false })
})

// Reset selected conversation when sort/filter changes
watch(receivedSort, () => {
  selectedConversation.value = null
})



</script>

<style lang="scss" scoped>
@use '#styles/_utils/media' as mq;

.messages-page {
  display: flex;
  flex-direction: column;
  gap: var(--size-16);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  min-width: 0;

  @include mq.mobile-only {
    display: none;
  }
}

.messages-header-card {
  background: var(--background-200);
  border-radius: var(--border-radius-xl);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: var(--size-24);
}

.messages-title {
  margin: 0 0 var(--size-16) 0;
  color: var(--foreground-100);
}

.messages-controls {
  width: 100%;
}

.messages-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--size-16);
  height: 60vh;
  overflow: hidden;

  @include mq.not-notebook {
    grid-template-columns: 1fr;
    gap: var(--size-12);
    height: auto;
    overflow: visible;
  }
}

.conversations-card {
  background: var(--background-200);
  border-radius: var(--border-radius-xl);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: var(--size-8);
  overflow-y: auto;

  @include mq.not-notebook {
    height: 50vh;
  }
}

.conversation-details-card {
  background: var(--background-200);
  border-radius: var(--border-radius-xl);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: var(--size-16);
  overflow-y: auto;

  @include mq.not-notebook {
    height: 50vh;
  }
}


.mobile-chat-page {
  display: none;

  @include mq.mobile-only {
    display: block;
    width: 100%;
    padding-bottom: calc(var(--size-16) + var(--mobile-nav-height, 0));
  }
}

.content-section {
  background: var(--background-200);
  padding: var(--size-16);
  border-radius: var(--border-radius-xl);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: var(--size-24);
  min-width: 0;

  @include mq.mobile-only {
    padding: var(--size-16);
    gap: var(--size-16);
  }
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: var(--size-16);
}

.filters-bar {
  border-bottom: 1px solid var(--background-300);
  padding-bottom: var(--size-16);
}

.search-sort-row {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: var(--size-12);
  align-items: center;

  @include mq.tablet {
    grid-template-columns: 2fr 1fr;
  }

  @include mq.mobile-only {
    grid-template-columns: 1fr;
    gap: var(--size-8);
  }
}


.sort-select {
  min-width: 160px;
  padding: var(--size-8) var(--size-12);
  height: var(--input-text-height);
  align-items: center;

  @include mq.mobile-only {
    width: 100%;
    min-width: unset;
  }
}


.conversations-list {
  background: var(--background-200);
  border-radius: var(--border-radius-lg);
  overflow-y: auto;
  padding-right: var(--size-8);

}

.conversation-content {
  display: flex;
  flex-direction: column;
  gap: var(--size-16);
  height: 100%;
}


.messages-container {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding-right: var(--size-8);
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
  color: var(--foreground-100);
  opacity: 0.7;
}

.collapse-fade-enter-active,
.collapse-fade-leave-active {
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s;
  overflow: hidden;
}

.collapse-fade-enter-from,
.collapse-fade-leave-to {
  max-height: 0;
  opacity: 0;
}

.collapse-fade-enter-to,
.collapse-fade-leave-from {
  max-height: 2000px;
  opacity: 1;
}
</style>