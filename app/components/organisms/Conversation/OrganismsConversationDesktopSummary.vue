<template>
  <div class="o-desktop-conversation-summary">
    <ClientOnly>
      <template v-if="loading">
        <div class="o-desktop-conversation-summary__loading">
          <SkeletonLoader class="o-desktop-conversation-summary__skeleton" />
          <SkeletonLoader class="o-desktop-conversation-summary__skeleton" />
          <SkeletonLoader class="o-desktop-conversation-summary__skeleton" />
        </div>
      </template>
      <template v-else-if="conversations.length > 0">
        <ul class="o-desktop-conversation-summary__list">
          <MoleculesConversationSummaryItem 
            v-for="conversation in conversations" 
            :key="conversation.id"
            :conversation="conversation" 
            :current-user-id="currentUserId"
            :is-active="conversation.id === props.activeConversationId"
            @select-conversation="handleConversationSelect" 
          />
        </ul>
      </template>
      <template v-else>
        <div class="o-desktop-conversation-summary__empty">
          <p class="o-desktop-conversation-summary__empty-text | body-sm">
            {{ emptyMessage }}
          </p>
        </div>
      </template>
      <template #fallback>
        <div class="o-desktop-conversation-summary__loading">
          <SkeletonLoader class="o-desktop-conversation-summary__skeleton" />
          <SkeletonLoader class="o-desktop-conversation-summary__skeleton" />
          <SkeletonLoader class="o-desktop-conversation-summary__skeleton" />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  conversations: ConversationWithUserAndMessages[]
  loading?: boolean
  currentUserId?: number | string | null
  emptyMessage?: string
  activeConversationId?: number | null
}>()

const emit = defineEmits<{
  "select-conversation": [conversation: ConversationWithUserAndMessages]
}>()

const { user } = useUserSession()

const currentUserId = computed(() => props.currentUserId || user.value?.id)

function handleConversationSelect(conversation: ConversationWithUserAndMessages) {
  emit("select-conversation", conversation)
}
</script>

<style lang="scss" scoped>
@use '#styles/_utils/media' as mq;

.o-desktop-conversation-summary {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  justify-content: center;

  ul, li {
    padding: 0;
    margin: 0;
  }

  &__loading {
    display: flex;
    flex-direction: column;
    gap: var(--size-8);
    padding: var(--size-16);
  }

  &__skeleton {
    height: 80px;
    border-radius: var(--border-radius-md);
  }

  &__list {
    list-style: none;
    margin: 0;
    padding: var(--size-8) var(--size-16) var(--size-8) var(--size-8);
    display: flex;
    flex-direction: column;
    gap: var(--size-4);
    overflow-y: auto;
    max-height: 100%;
    -webkit-overflow-scrolling: touch;
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: var(--size-48) var(--size-24);
    height: 200px;
  }

  &__empty-text {
    color: var(--foreground-100);
    opacity: 0.7;
  }
}
</style>