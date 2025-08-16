<template>
  <div class="messages-page">
    <!-- Received Enquiries Section -->
    <div class="content-section">
      <AtomsCollapsibleHeader 
        :is-collapsed="isReceivedCollapsed" 
        @toggle="isReceivedCollapsed = !isReceivedCollapsed"
        :title="sectionTitle" 
        icon="account/chat" 
        variant="inline"
      />
      <Transition name="collapse-fade">
        <div v-show="!isReceivedCollapsed" class="section-content">
          <div class="filters-bar">
            <div class="search-sort-row">
              <AtomsInput
                v-model="receivedSearch"
                type="text"
                placeholder="Search received enquiries..."
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
          <div class="conversations-grid" :class="{ 'conversations-grid--has-active-conversation': selectedConversation }">
            <div class="conversations-list">
              <OrganismsConversationDesktopSummary 
                :conversations="filteredReceivedConversations"
                :loading="loading"
                :active-conversation-id="selectedConversation?.id"
                :empty-message="emptyMessage"
                @select-conversation="handleConversationSelect"
              />
            </div>
            <div class="conversation-details">
              <div v-if="selectedConversation" class="conversation-content">
                <MoleculesConversationListingCard :conversation="selectedConversation" variant="horizontal" />
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
      </Transition>
    </div>


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

// Collapse states
const isReceivedCollapsed = ref(false)

// Search states
const receivedSearch = ref("")

// Sort states
const receivedSort = ref("received")

// Selected conversation
const selectedConversation = ref<ConversationWithUserAndMessages | null>(null)
const messagesContainer = ref<HTMLDivElement | null>(null)


const sortOptions = [
  { key: "All Enquiries", value: "all" },
  { key: "Received Enquiries", value: "received" },
  { key: "Sent Enquiries", value: "sent" },
  { key: "Recent", value: "recent" },
  { key: "Oldest", value: "oldest" },
  { key: "Unread", value: "unread" },
  { key: "Read", value: "read" }
]

// Apply search and sort filters using conversation utils
const filteredReceivedConversations = computed(() => {
  let conversations = allConversations.value || []
  
  // Apply search filter first
  if (receivedSearch.value.trim()) {
    conversations = filterConversations(conversations, receivedSearch.value)
  }
  
  // Apply sorting and filtering using the conversation utility
  return sortConversations(conversations, receivedSort.value, user.value?.id)
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
  selectedConversation.value = conversation
  // Scroll to bottom when conversation is selected
  nextTick(() => {
    scrollToBottom(messagesContainer.value)
  })
}

async function handleSendReply(message: string) {
  if (!selectedConversation.value || !message.trim()) return

  const conversationActions = useConversationActions(useConversationState())
  
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
watch(() => selectedConversation.value?.messages?.length, () => {
  nextTick(() => {
    scrollToBottom(messagesContainer.value)
  })
})

// Reset selected conversation when sort/filter changes
watch(receivedSort, () => {
  selectedConversation.value = null
})

// Auto-open chat on mobile when page loads
onMounted(() => {
  if (import.meta.client && window.innerWidth <= 768) {
    // Find the mobile navigation component and trigger chat open
    const event = new CustomEvent('openMobileChat')
    window.dispatchEvent(event)
  }
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

  @include mq.mobile-only {
    grid-template-columns: 1fr;
    gap: var(--size-8);
  }
}


.sort-select {
  min-width: 160px;
  padding: var(--size-8) var(--size-12);

  @include mq.mobile-only {
    width: 100%;
    min-width: unset;
  }
}

.conversations-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--size-16);
  height: fit-content;
  overflow: hidden;

  // When there's an active conversation, use fixed height for scrolling
  &--has-active-conversation {
    height: 60vh;

    @include mq.not-notebook {
      height: 500px;
    }

    @include mq.mobile-only {
      height: 400px;
    }
  }

  @include mq.not-notebook {
    grid-template-columns: 1fr;
    gap: var(--size-12);
  }

}

.conversations-list {
  background: var(--background-200);
  border-radius: var(--border-radius-lg);
  overflow-y: auto;
  padding-right: var(--size-8);
  
  .conversations-grid:not(.conversations-grid--has-active-conversation) & {
    height: fit-content;
    max-height: 60vh;
  }
  
  .conversations-grid--has-active-conversation & {
    height: 100%;
  }
}

.conversation-details {
  background: var(--background-200);
  border-radius: var(--border-radius-lg);
  overflow-y: auto;
  padding-right: var(--size-8);
  
  .conversations-grid--has-active-conversation & {
    height: 100%;
  }
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