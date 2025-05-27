<template>
  <li
    :class="messageClass"
    class="m-message-bubble | box"
  >
    <div class="m-message-header">
      <p class="| body-xs font-bold">{{ messageSenderName }}</p>
      <p class="| body-xs">{{ formattedTimestamp }}</p>
    </div>
    <p class="| body-md">{{ message.content }}</p>
    <div v-if="message.readAt && messageSenderName === 'You'" class="m-read-receipt | body-xs">
      Read {{ formatReadTimestamp(message.readAt) }}
    </div>
  </li>
</template>

<script setup lang="ts">
import type { MessageWithUser } from '~~/shared/types/conversation';
import { getConvoMessagePoV, formatMessageTimestamp, formatMessageTimestampToTime } from '../utils/message';

interface Props {
  message: MessageWithUser & { readAt?: string | Date };
  currentUserId?: string | number;
}

const props = defineProps<Props>();

const messageSenderName = computed(() => {
  return getConvoMessagePoV(props.message, props.currentUserId);
});

const formattedTimestamp = computed(() => {
  return formatMessageTimestamp(props.message.createdAt);
});

const formatReadTimestamp = (timestamp: string | Date) => {
  return formatMessageTimestampToTime(timestamp);
};

const messageClass = computed(() => {
  return getConvoMessagePoV(props.message, props.currentUserId) === 'You' ? 'm-message-sender' : 'm-message-receiver';
});

</script>

<style lang="scss" scoped>
.m-message-bubble {
  display: flex;
  flex-direction: column;
  padding: 8px 16px;
  border-radius: var(--border-radius-lg);
  margin-bottom: 16px;
  max-width: 70%;
  word-wrap: break-word;
}

.m-read-receipt {
  text-align: right;
  color: var(--foreground-500);
  margin-top: 4px;
}

.m-message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 4px;
  margin-bottom: 4px; 
  border-bottom: 1px solid transparent;
}

.m-message-sender {
  background: var(--background-200);
  color: var(--foreground-100);
  margin-left: auto;
  border-bottom-right-radius: 0;
}

.m-message-receiver {
  background: var(--primary-300);
  color: var(--background-100);
  font-weight: 600; 
  margin-right: auto; 
  border-bottom-left-radius: 0; 

  .m-message-header p {
    color: var(--background-200);
  }
}
</style>
