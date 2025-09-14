<template>
  <div class="conversation-messages">
    <ul class="messages-list">
      <li v-for="message in messages" :key="message.id" class="message-item">
        <AtomsConversationBubble
          :user="message.sender?.username || message.sender?.email"
          :content="message.content"
          :variant="getMessageVariant(message)"
        >
          <template #status>
            <AtomsConversationStatus
              :timestamp="formatMessageTimestamp(message.createdAt)"
              :show-read-status="getShowReadStatus(message)"
              :is-read="message.isRead"
            />
          </template>
        </AtomsConversationBubble>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  messages: MessageWithUser[];
  currentUserId?: number | string | null;
}>();

const getMessageVariant = (message: MessageWithUser) => {
  return message.senderId === props.currentUserId ? 'sent' : 'received';
};

const getShowReadStatus = (message: MessageWithUser) => {
  return message.senderId === props.currentUserId;
};

</script>

<style lang="scss" scoped>
.conversation-messages {
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
    display: flex;
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
