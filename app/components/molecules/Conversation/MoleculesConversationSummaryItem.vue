<template>
  <li class="m-chat-summary-item" :class="{ 'm-chat-summary-item--active': isActive }"
    @click="$emit('select-conversation', conversation)">
    <div class="m-chat-summary-item__content">
      <!-- Row 1: Image + Name -->
      <div class="m-chat-summary-item__row m-chat-summary-item__row--top">
        <AtomsCloudFlareImage :src="firstImage" alt="" variant="thumbnail" class="m-chat-summary-item__image" />
        <div class="m-chat-summary-item__info">
          <span class="m-chat-summary-item__username | body-sm font-semibold"
            :class="{ 'unread': unreadMessages > 0 }">{{ formattedPartnerName }}</span>
          <span class="m-chat-summary-item__time | body-xs">{{ lastMessageTime }}</span>
        </div>
        <button v-if="unreadMessages > 0"
          class="m-chat-summary-item__unread m-chat-summary-item__unread--top | button button-tertiary button-xs">{{
            unreadMessages }}</button>
      </div>

      <!-- Row 2: Address -->
      <p class="m-chat-summary-item__address | body-xs">{{ conversationAddress }}</p>

      <!-- Row 3: Message Snippet -->
      <p class="m-chat-summary-item__message | body-sm">{{ lastMessageContent }}</p>
    </div>
  </li>
</template>

<script setup lang="ts">
import type { ConversationWithMinimalListing } from "~~/shared/types/conversation";

interface Props {
  conversation: ConversationWithMinimalListing;
  currentUserId?: string | number;
  isActive?: boolean;
}

const props = defineProps<Props>();

defineEmits<{
  "select-conversation": [conversation: ConversationWithMinimalListing];
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
  const baseContent = getLastMessageContent(props.conversation);
  const lastMessage = props.conversation.messages[props.conversation.messages.length - 1];

  if (lastMessage && lastMessage.senderId === props.currentUserId) {
    return `You: ${baseContent}`;
  }

  return baseContent;
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
  return getMainImage(props.conversation.listing?.property) || "/img/preload.svg";
});
</script>

<style lang="scss" scoped>
@use '#styles/_utils/media' as mq;

.m-chat-summary-item {
  cursor: pointer;
  padding: var(--size-8);
  color: var(--monochrome-100);
  background: var(--background-100);
  border-radius: var(--border-radius-xl);

  &:hover {
    background: var(--background-200);
    border-radius: var(--border-radius-xl);
    color: var(--foreground-100);
  }

  &--active {
    background: var(--blue-400);
    border-radius: var(--border-radius-xl);
    color: var(--monochrome-100);

    &:hover {
      background: var(--blue-400);
    }

    .m-chat-summary-item__address,
    .m-chat-summary-item__username,
    .m-chat-summary-item__time,
    .m-chat-summary-item__message {
      color: var(--monochrome-900);
    }

    .m-chat-summary-item__address,
    .m-chat-summary-item__time {
      color: var(--monochrome-600);
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--size-4);
    padding: var(--size-12);

    @include mq.mobile-only {
      padding: var(--size-8);
    }

    .right-sidebar & {
      padding: 0;
    }
  }

  &__row {
    display: flex;
    align-items: center;
    gap: var(--size-8);
    min-width: 0;
  }

  &__row--top {
    align-items: center;
    gap: var(--size-8);
  }

  &__image {
    width: 40px;
    height: 40px;
    border-radius: var(--border-radius-md);
    flex-shrink: 0;
  }

  &__username {
    color: var(--foreground-100);
    text-transform: capitalize;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: var(--size-2);
    min-width: 0;
    flex: 1;
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
  }

  &__unread.button {
    border-radius: 50%;
    line-height: var(--font-xs);
    color: var(--monochrome-900);
  }

  &__unread--top {
    flex-shrink: 0;
  }

  &__message {
    margin: 0;
    color: var(--foreground-100);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .unread {
    color: light-dark(var(--blue-400), var(--blue-600));
  }
}
</style>
