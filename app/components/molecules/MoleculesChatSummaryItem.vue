<template>
  <li class="m-chat-summary-item" @click="$emit('select-conversation', conversation)">
    <div class="m-chat-summary-item__content">
      <div class="m-chat-summary-item__header">
        <span class="m-chat-summary-item__username | body-sm font-semibold" :class="{
          'unread': unreadMessages > 0
        }">{{ formattedPartnerName }}</span>
        <span class="m-chat-summary-item__time | body-xs">{{ lastMessageTime }}</span>
      </div>
      <div class="m-chat-summary-item-message">
        <p class="m-chat-summary-item-message__content | body-xs">{{ lastMessageContent }}</p>
        <button v-if="unreadMessages > 0" class="m-chat-summary-item-message__unread | button button-secondary button-xs">{{ unreadMessages }}</button>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
interface Props {
  conversation: ConversationWithUserAndMessages;
  currentUserId?: string | number;
}

const props = defineProps<Props>();

defineEmits<{
  "select-conversation": [conversation: ConversationWithUserAndMessages];
}>();

const conversationPartnerName = computed(() => {
  const pov = getConversationPoV(props.conversation, props.currentUserId);
  // If pov is an object with a name property, use that. Otherwise, assume it's already a string.
  return typeof pov === "object" && pov !== null && "name" in pov ? pov.name : pov;
});

const formattedPartnerName = computed(() => {
  const name = conversationPartnerName.value;
  return typeof name === "string" ? formatPartnerName(name) : name;
});

const lastMessageContent = computed(() => {
  return getLastMessageContent(props.conversation);
});

const lastMessageTime = computed(() => {
  return getLastMessageTime(props.conversation);
});

const unreadMessages = computed(() => {
  return props.conversation.messages.filter((message) => !message.isRead && message.senderId !== props.currentUserId).length;
});
</script>

<style lang="scss" scoped>
.m-chat-summary-item {
  padding: var(--size-8);
  cursor: pointer;
  border-radius: var(--border-radius-lg);

  .unread {
    color: var(--secondary-400);
  }

  &:hover {
    background: var(--background-100);
  }

  &__content {
    display: flex;
    flex-direction: column;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--size-4);
  }

  &__username {
    color: var(--foreground-100);
    text-transform: capitalize;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
  }

  &__time {
    font-size: 0.75rem;
    color: var(--foreground-200);
    white-space: nowrap;
    flex-shrink: 0;
  }

  &-message {
    color: var(--foreground-100);
    margin: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--size-8);

    &__content {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__unread {
      color: var(--background-100);

      &.button {
        border-radius: 50%;
        line-height: var(--font-xs);
      }
    }
  }
}
</style>
