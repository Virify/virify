<template>
  <div class="o-chat-summary" :class="{ collapsed: isCollapsed }">
    <div class="o-chat-summary__header" @click="toggleCollapsed">
      <h3 class="o-chat-summary__title | title-xs">Enquiries 
        <span class="o-chat-summary__count | body-sm">({{ enquiriesCount }})</span>
      </h3>
      <button class="o-chat-summary__toggle-btn" :class="{ 'o-chat-summary__toggle-btn--collapsed': isCollapsed }">
        <AtomsIcon icon="chevron-down" size="16" />
      </button>
    </div>
    <div class="o-chat-summary__content" v-show="!isCollapsed">
      <div class="o-chat-summary__filters-row">
        <AtomsSelect 
          v-model="sortBy" 
          :options="sortOptions"
          class="o-chat-summary__sort-select | body-sm"
        />
      </div>
      <template v-if="searchEnabled !== false">
        <div class="o-chat-summary__search-row">
          <input
            v-model="search"
            type="text"
            class="o-chat-summary__search-input | body-sm"
            placeholder="Search enquiries..."
            autocomplete="off"
          />
        </div>
      </template>
      <ClientOnly>
        <template v-if="loading">
          <div class="o-chat-summary__loading">
            <SkeletonLoader class="o-chat-summary__skeleton" />
            <SkeletonLoader class="o-chat-summary__skeleton" />
            <SkeletonLoader class="o-chat-summary__skeleton" />
          </div>
        </template>
        <template v-else-if="filteredConversations.length > 0">
          <ul class="o-chat-summary__list">
            <MoleculesChatSummaryItem v-for="conversation in filteredConversations" :key="conversation.id"
              :conversation="conversation" :current-user-id="user?.id"
              @select-conversation="handleConversationSelect" />
          </ul>
          <div v-if="limit" class="o-chat-summary__footer">
            <NuxtLink to="/account/messages">
              <button class="button button-sm button-secondary">See all</button>
            </NuxtLink>
          </div>
        </template>
        <template v-else>
          <div class="o-chat-summary__empty">
            <p class="o-chat-summary__empty-text | body-sm">No enquiries found</p>
          </div>
        </template>
        <template #fallback>
          <div class="o-chat-summary__loading">
            <SkeletonLoader class="o-chat-summary__skeleton" />
            <SkeletonLoader class="o-chat-summary__skeleton" />
            <SkeletonLoader class="o-chat-summary__skeleton" />
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  limit?: number
  searchEnabled?: boolean
  disableNavigate?: boolean
}>()

const { limit, searchEnabled, disableNavigate } = toRefs(props)

const emit = defineEmits<{
  /** Emitted when a conversation is selected if disableNavigate is true */
  "select-conversation": [conversation: ConversationWithUserAndMessages];
  /** Emitted when the collapsed state changes */
  "toggle-collapsed": [collapsed: boolean];
}>();

const { user } = useUserSession()
const { allConversations, loading, filterConversations } = useConversations()
const { getAggregateCount } = useNotifications()

const isCollapsed = ref(false)
const search = ref("")
const sortBy = ref("all")

const sortOptions = [
  { key: "All", value: "all" },
  { key: "Unread", value: "unread" },
  { key: "Received", value: "received" },
  { key: "Sent", value: "sent" },
  { key: "Recent", value: "recent" },
  { key: "Oldest", value: "oldest" }
]

// Get unread enquiries count from aggregates instead of calculating manually
const enquiriesCount = computed(() => {
  return getAggregateCount('unreadMessages') || 0;
});

const allLimitedConversations = computed(() => {
  let conversations = allConversations.value || [];
  
  // Apply sorting using the conversation util
  conversations = sortConversations(conversations, sortBy.value, user.value?.id);
  
  if (!limit?.value || limit.value === 0) {
    return conversations;
  }
  return conversations.slice(0, limit.value);
})

const filteredConversations = computed(() => {
  if (searchEnabled?.value === false || !search.value.trim()) {
    return allLimitedConversations.value
  }
  return filterConversations(allLimitedConversations.value, search.value)
})

function handleConversationSelect(conversation: ConversationWithUserAndMessages) {
  if (disableNavigate?.value) {
    emit("select-conversation", conversation)
    return
  }
  navigateTo(`/account/messages?conversation=${conversation.id}`)
}

function toggleCollapsed() {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style lang="scss" scoped>
@use '#styles/_utils/media' as mq;
.o-chat-summary {
  height: fit-content;
  max-height: calc(100vh - var(--header-expanded-height) + var(--size-32));
  display: flex;
  flex-direction: column;
  
  &.collapsed {
    height: auto;
  }
  
  @include mq.tablet-only {
    max-height: 60vh; /* Reduce max height on tablet */
  }
  
  @include mq.mobile-only {
    height: 100%;
    max-height: none;
    
    &.collapsed {
      height: auto;
    }
  }
  

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--foreground-100);
    cursor: pointer;
    border-radius: var(--border-radius-md);
    padding: var(--size-16);
    
    @include mq.mobile-only {
      display: none;
    }
  }

  &__title {
    margin: 0;
    flex: 1;
  }

  &__toggle-btn {
    background: none;
    border: none;
    color: var(--foreground-100);
    cursor: pointer;
    padding: var(--size-4);
    border-radius: var(--border-radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: var(--background-400);
    }

    :deep(svg) {
      transition: transform 0.2s ease;
      transform: rotate(180deg);
    }

    &--collapsed {
      :deep(svg) {
        transform: rotate(0deg);
      }
    }
  }

  &__count {
    color: var(--secondary-400);
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 0;
  }

  &__loading {
    display: flex;
    flex-direction: column;
    gap: var(--size-8);
  }

  &__skeleton {
    height: 60px;
    border-radius: var(--border-radius-md);
  }

  &__list {
    flex: 1;
    list-style: none;
    margin: 0;
    padding: 0 var(--size-16) var(--size-16) var(--size-16);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--size-8);
    min-height: 0;
    
    @include mq.mobile-only {
      padding: var(--size-16);
    }
  }

  &__footer {
    margin-top: var(--size-12);
    padding-top: var(--size-12);
    text-align: center;
  }

  &__empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: var(--size-24);
  }

  &__empty-text {
    color: var(--foreground-100);
  }

  &__filters-row {
    padding: 0 var(--size-16);
    margin: var(--size-8) 0;

    .a-select {
      width: 100%;
    }
  }

  &__search-row {
    padding: 0 var(--size-16);
    margin: var(--size-8) 0;
  }

  &__search-input {
    display: block;
    width: 100%;
    padding: var(--size-8) var(--size-12);
    border-radius: var(--border-radius-2xl);
    border: 1px solid var(--foreground-200);
    background: var(--background-200);
    color: var(--foreground-100);
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: var(--secondary-400);
    }
  }
}
</style>
