<template>
  <li class="m-chat-summary-item" :class="{ 'm-chat-summary-item--active': isActive }" @click="$emit('select-conversation', conversation)">
    <div class="m-chat-summary-item__content">
      <div class="m-chat-summary-item__header">
        <div class="m-chat-summary-item__title">
        <nuxt-img :src="firstImage" alt="" width="40" height="40" placeholder="/img/preload.svg" />
          <div class="m-chat-summary-item__name-section">
            <span class="m-chat-summary-item__username | body-sm font-semibold" :class="{
              'unread': unreadMessages > 0
            }">{{ formattedPartnerName }}</span>
            <p class="m-chat-summary-item__address | body-xs">{{ conversationAddress }}</p>
          </div>
        </div>
        <span class="m-chat-summary-item__time | body-xs">{{ lastMessageTime }}</span>
      </div>
      <div class="m-chat-summary-item-message">
        <p class="m-chat-summary-item-message__content | body-sm">{{ lastMessageContent }}</p>
        <button v-if="unreadMessages > 0"
          class="m-chat-summary-item-message__unread | button button-secondary button-xs">{{ unreadMessages }}</button>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
interface Props {
  conversation: ConversationWithUserAndMessages;
  currentUserId?: string | number;
  isActive?: boolean;
}

const props = defineProps<Props>();

defineEmits<{
  "select-conversation": [conversation: ConversationWithUserAndMessages];
}>();

const conversationPartnerName = computed(() => {
  const pov = getConversationPoV(props.conversation, props.currentUserId);
  return pov.name;
});

const formattedPartnerName = computed(() => {
  const name = conversationPartnerName.value;
  return typeof name === "string" ? formatPartnerName(name) : name;
});

const lastMessageContent = computed(() => {
  return getLastMessageContent(props.conversation);
});

const lastMessageTime = computed(() => {
  return formatMessageTimestamp(props.conversation.updatedAt);
});

const unreadMessages = computed(() => {
  return props.conversation.messages.filter((message) => !message.isRead && message.senderId !== props.currentUserId).length;
});

const conversationAddress = computed(() => {
  return props.conversation.listing?.property?.address?.fullAddress || "Address not available";
});

const firstImage = computed(() => {
  return props.conversation.listing?.property?.media?.[0]?.image || "/img/preload.svg";
});
</script>

<style lang="scss" scoped>
@use '#styles/_utils/media' as mq;

.m-chat-summary-item {
  cursor: pointer;
  padding: var(--size-8);

  .unread {
    color: var(--secondary-400);
  }

  &:hover {
    background: var(--background-100);
    border-radius: var(--border-radius-xl);
  }

  &--active {
    background: var(--secondary-500);
    border-radius: var(--border-radius-xl);

    .m-chat-summary-item__address {
      color: var(--monochrome-300);
    }

    &:hover {
      background: var(--secondary-500);
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    padding: var(--size-16);

    @include mq.mobile-only {
      padding: var(--size-8);
    }

    .right-sidebar & {
      padding: 0;
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--size-2);
    margin-bottom: var(--size-4);
  }

  &__title {
    display: flex;
    flex-direction: row;
    gap: var(--size-8);
    flex: 1;
    min-width: 0;
    justify-content: center;
    align-items: center;

    & img {
      border-radius: var(--border-radius-md);
    }
  }

  &__name-section {
    display: flex;
    flex-direction: column;
    gap: var(--size-2);
    flex: 1;
    min-width: 0;
  }

  &__username {
    color: var(--foreground-100);
    text-transform: capitalize;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__address {
    margin: 0;
    color: var(--monochrome-500);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__time {
    font-size: 0.75rem;
    color: var(--foreground-200);
    white-space: nowrap;
    flex-shrink: 0;
    margin-top: 2px;
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
