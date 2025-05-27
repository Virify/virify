<template>
  <li
    class="m-conversation-list-item | body-md box"
    :class="{ 'active': isActive }"
    @click="emitSelectConversation"
  >
    <div class="m-conversation-info">
      <AtomsIcon name="profile" icon="profile" height="24" width="24" class="m-conversation-avatar" />
      <div class="m-conversation-details">
        <strong class="body-sm">{{ conversationPartnerName }}</strong>
        <p class="body-xs m-last-message-content">{{ lastMessageContent }}</p>
      </div>
    </div>
    <p class="m-conversation-time | body-sm ">{{ lastMessageTime }}</p>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ConversationWithUserAndMessages } from '~~/shared/types/conversation';
import { getConversationPoV } from '../utils/conversation';
import { formatMessageTimestampToTime } from '../utils/message';

interface Props {
  conversation: ConversationWithUserAndMessages;
  currentUserId?: string | number;
  isActive: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits(['select-conversation']);

const conversationPartnerName = computed(() => {
  const pov = getConversationPoV(props.conversation, props.currentUserId);
  // If pov is an object with a name property, use that. Otherwise, assume it's already a string.
  return typeof pov === 'object' && pov !== null && 'name' in pov ? pov.name : pov;
});

const lastMessage = computed(() => {
  if (props.conversation.messages && props.conversation.messages.length > 0) {
    return props.conversation.messages[props.conversation.messages.length - 1];
  }
  return null;
});

const lastMessageContent = computed(() => {
  return lastMessage.value?.content || '';
});

const lastMessageTime = computed(() => {
  return lastMessage.value ? formatMessageTimestampToTime(lastMessage.value.createdAt) : '';
});

function emitSelectConversation() {
  emit('select-conversation', props.conversation);
}
</script>

<style lang="scss" scoped>
.m-conversation-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: var(--background-200);
  color: var(--foreground-100);
  cursor: pointer;
  border-radius: var(--border-radius-md);
  gap: 8px;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

  .m-conversation-info {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-grow: 1;
    min-width: 0;
  }

  .m-conversation-details {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-width: 0;
  }

  .m-last-message-content {
    color: var(--foreground-600);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .m-conversation-time {
    white-space: nowrap;
    margin-left: auto; 
    flex-shrink: 0;
  }

  .m-conversation-avatar {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }

  &:hover {
    background-color: var(--primary-200);
    color: var(--foreground-900);
  }

  &.active {
    background-color: var(--primary-300);
    color: var(--background-100);

    .m-last-message-content {
      color: var(--background-200);
    }
  }
}
</style>
