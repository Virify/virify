<template>
  <div class="o-chat-summary">
    <div class="o-chat-summary__header">
      <h3 class="o-chat-summary__title | title-xs">Enquiries</h3>
      <span class="o-chat-summary__count | body-sm font-semibold" v-if="enquiriesCount && enquiriesCount > 0">
        {{ enquiriesCount }}
      </span>
    </div>

    <div class="o-chat-summary__content">
      <ClientOnly>
        <template v-if="loading">
          <div class="o-chat-summary__loading">
            <SkeletonLoader class="o-chat-summary__skeleton" />
            <SkeletonLoader class="o-chat-summary__skeleton" />
            <SkeletonLoader class="o-chat-summary__skeleton" />
          </div>
        </template>

        <template v-else-if="conversations.length > 0">
          <ul class="o-chat-summary__list">
            <MoleculesChatSummaryItem v-for="conversation in conversations" :key="conversation.id"
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
            <p class="o-chat-summary__empty-text">No enquiries yet</p>
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

const { user } = useUserSession();
const { conversations, loading } = useConversations({ limit: 5 });
const { getAggregateCount } = useNotifications();

// Get the enquiries count from the notifications system
const enquiriesCount = computed(() => getAggregateCount('enquiries'));

function handleConversationSelect(conversation: ConversationWithUserAndMessages) {
  // Navigate to messages page with the conversation selected
  navigateTo(`/account/messages?conversation=${conversation.id}`);
}
</script>

<style lang="scss" scoped>
.o-chat-summary {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--size-16);
    color: var(--monochrome-900);
  }

  &__title {
    margin: 0;
    color: var(--monochrome-900);
    padding: var(--size-8);
  }

  &__count {
    color: var(--monochrome-900);
    background: var(--secondary-400);
    padding: var(--size-4) var(--size-8);
    border-radius: var(--border-radius-md);
    text-align: center;
    color: var(--background-100);
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
}
</style>
