<template>
  <div class="enquiry-messages">
    <ul class="messages-list">
      <li v-for="message in messages" :key="message.id" class="message-item"
        :class="{ 'from-me': message.senderId === currentUserId }">
        <p class="message-content | body-sm">{{ message.content }}</p>
        <div class="message-status">
          <span class="message-time | body-xs">{{ formatMessageTimestamp(message.createdAt) }}</span>
          <div v-if="message.senderId === currentUserId" class="message-read-status">
            <AtomsIcon :icon="message.isRead ? 'account/read' : 'account/sent'" size="12" />
            <span class="status-text | body-xs">{{ message.isRead ? 'Read' : 'Sent' }}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  messages: MessageWithUser[];
  currentUserId?: number | string | null;
}>();

</script>

<style lang="scss" scoped>
.enquiry-messages {
  padding: 0;

  .messages-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--size-12);
  }

  .message-item {
    background: var(--primary-600);
    padding: var(--size-12) var(--size-16);
    border-radius: var(--border-radius-lg);
    border-bottom-left-radius: 0;
    max-width: 280px;
    align-self: flex-start;
    position: relative;

    &.from-me {
      background: var(--secondary-500);
      color: var(--foreground-100);
      align-self: flex-end;
      border-bottom-left-radius: var(--border-radius-lg);
      border-bottom-right-radius: 0;
    }

    .message-content {
      margin: 0 0 var(--size-8) 0;
      color: var(--monochrome-100);
    }

    .message-status {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--size-8);
      color: var(--monochrome-300);

      .message-time {
        color: var(--monochrome-300);
        flex-shrink: 0;
      }

      .message-read-status {
        display: flex;
        align-items: center;
        gap: var(--size-4);
      }
    }
  }
}
</style>
