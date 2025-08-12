<template>
  <li class="m-chat-summary-item" @click="$emit('select-conversation', conversation)">
    <div class="m-chat-summary-item__content">
      <div class="m-chat-summary-item__header">
        <span class="m-chat-summary-item__username | body-md font-semibold">{{ formattedPartnerName }}</span>
        <span class="m-chat-summary-item__time | body-sm">{{ lastMessageTime }}</span>
      </div>
      <p class="m-chat-summary-item__message | body-xs">{{ lastMessageContent }}</p>
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
  'select-conversation': [conversation: ConversationWithUserAndMessages]
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
</script>

<style lang="scss" scoped>
.m-chat-summary-item {
  padding: var(--size-8);
  cursor: pointer;
  border-radius: var(--border-radius-lg);

  &:hover {
    background: var(--blue-500);
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--size-4);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--size-8);
  }

  &__username {
    color: var(--monochrome-900);
    text-transform: capitalize;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
  }

  &__time {
    font-size: 0.75rem;
    color: var(--monochrome-600);
    white-space: nowrap;
    flex-shrink: 0;
  }

  &__message {
    font-size: 0.8125rem;
    color: var(--monochrome-800);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
  }
}
</style>
