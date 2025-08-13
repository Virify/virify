<template>
  <div class="o-chat-summary">
    <div class="o-chat-summary__header">
      <h3 class="o-chat-summary__title | title-xs">Enquiries 
        <span class="o-chat-summary__count | body-sm">({{ enquiriesCount }})</span>
      </h3>
    </div>
    <div class="o-chat-summary__content">
      <template v-if="props.searchEnabled !== false">
        <div class="o-chat-summary__search-row">
          <input
            v-model="search"
            type="text"
            class="o-chat-summary__search-input"
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
          <div class="o-chat-summary__footer">
            <NuxtLink to="/account/messages">
              <button class="button button-sm button-secondary">See all</button>
            </NuxtLink>
          </div>
        </template>
        <template v-else>
          <div class="o-chat-summary__empty">
            <p class="o-chat-summary__empty-text">No enquiries found</p>
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
  limit?: number,
  searchEnabled?: boolean
}>();

const { user } = useUserSession();
const { allConversations, loading } = useConversations();
const { getAggregateCount } = useNotifications();

// Get the enquiries count from the notifications system
const enquiriesCount = computed(() => getAggregateCount('enquiries'));


const search = ref("");

// Limit conversations based on the limit prop
const allLimitedConversations = computed(() => {
  if (!props.limit || props.limit === 0) {
    return allConversations.value;
  }
  return allConversations.value.slice(0, props.limit);
});

const filteredConversations = computed(() => {
  if (props.searchEnabled === false || !search.value.trim()) return allLimitedConversations.value;
  const term = search.value.trim().toLowerCase();
  return allLimitedConversations.value.filter(c => {
    // Search by sender/receiver name or username, listing title, or last message content
  const senderUsername = c.sender?.username?.toLowerCase() || "";
  const senderEmail = c.sender?.email?.toLowerCase() || "";
  const receiverUsername = c.receiver?.username?.toLowerCase() || "";
  const receiverEmail = c.receiver?.email?.toLowerCase() || "";
    const listingTitle = c.listing?.title?.toLowerCase() || "";
    const lastMsg = c.messages?.[c.messages.length-1]?.content?.toLowerCase() || "";
    return (
      senderUsername.includes(term) ||
      senderEmail.includes(term) ||
      receiverUsername.includes(term) ||
      receiverEmail.includes(term) ||
      listingTitle.includes(term) ||
      lastMsg.includes(term)
    );
  });
});

function handleConversationSelect(conversation: ConversationWithUserAndMessages) {
  // Navigate to messages page with the conversation selected
  navigateTo(`/account/messages?conversation=${conversation.id}`);
}
</script>

<style lang="scss" scoped>
@use '#styles/_utils/media' as mq;
.o-chat-summary {
  height: 100%;
  display: flex;
  flex-direction: column;
  

  &__header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--size-16);
    color: var(--foreground-100);
    
    @include mq.mobile-only {
      display: none;
    }
  }

  &__title {
    margin: 0;
    color: var(--foreground-100);
    padding: var(--size-8);
  }

  &__count {
    color: var(--secondary-400);
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
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
    padding: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--size-8);
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
    color: rgba(255, 255, 255, 0.7);
  }
  
  // Mobile-only overrides for when used in mobile overlay
  @include mq.mobile-only {
    height: auto;
    min-height: auto;
    
    &__content {
      overflow: visible;
      flex: none;
      height: auto;
    }
    
    &__list {
      overflow: visible;
      flex: none;
      max-height: none;
    }
  }
}
.o-chat-summary__search-row {
  padding: var(--size-4);
}
.o-chat-summary__search-input {
  display: block;
  width: 100%;
  padding: var(--size-8) var(--size-12);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-100);
  background: var(--background-100);
  color: var(--foreground-100);
  outline: none;
  transition: border-color 0.2s;
  margin-bottom: var(--size-4);
}
.o-chat-summary__search-input:focus {
  border-color: var(--primary-400);
}
</style>
