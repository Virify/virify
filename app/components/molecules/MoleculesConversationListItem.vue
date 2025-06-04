<template>
  <li class="m-conversation-list-item | body-md box" :class="{ active: isActive }" @click="emitSelectConversation">
    <div class="m-conversation-info">
      <AtomsIcon name="profile" icon="profile" height="24" width="24" class="m-conversation-avatar" />
      <div class="m-conversation-details">
        <strong class="body-sm m-conversation-name">{{ formattedPartnerName }}</strong>
        <p class="body-sm m-last-message-content">{{ lastMessageContent }}</p>
        <p class="m-conversation-listing-link | body-xs">{{ conversationAddress }}</p>
      </div>
      <p class="m-conversation-time">{{ lastMessageTime }}</p>
    </div>
  </li>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ConversationWithUserAndMessages } from "~~/shared/types/conversation";
import { getConversationPoV, formatMessageTimestampToTime } from "~/utils/conversation";

interface Props {
  conversation: ConversationWithUserAndMessages;
  currentUserId?: string | number;
  isActive: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits(["select-conversation"]);

const conversationPartnerName = computed(() => {
  const pov = getConversationPoV(props.conversation, props.currentUserId);
  // If pov is an object with a name property, use that. Otherwise, assume it's already a string.
  return typeof pov === "object" && pov !== null && "name" in pov ? pov.name : pov;
});

const formattedPartnerName = computed(() => {
  const name = conversationPartnerName.value;
  // If it's an email, just return the part before the @ symbol
  if (typeof name === "string" && name.includes("@")) {
    const parts = name.split("@");
    return parts[0]?.replace(/[._-]/g, " ") || name;
  }
  return name;
});

const lastMessage = computed(() => {
  if (props.conversation.messages && props.conversation.messages.length > 0) {
    return props.conversation.messages[props.conversation.messages.length - 1];
  }
  return null;
});

const lastMessageContent = computed(() => {
  return lastMessage.value?.content || "";
});

const lastMessageTime = computed(() => {
  return lastMessage.value ? formatMessageTimestampToTime(lastMessage.value.createdAt) : "";
});

const conversationAddress = computed(() => {
  return props.conversation.listing?.property?.address?.fullAddress || "Direct Message";
});

function emitSelectConversation() {
  emit("select-conversation", props.conversation);
}
</script>

<style lang="scss" scoped>
.m-conversation-list-item {
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  background-color: var(--background-200);
  color: var(--foreground-900);
  cursor: pointer;
  border-radius: var(--border-radius-md);
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  width: 100%;
  box-sizing: border-box;

  .m-conversation-info {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    width: 100%;
  }

  .m-conversation-details {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-width: 0;
    gap: 4px;
  }

  .m-last-message-content {
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    color: var(--foreground-800);
    margin: 0;
  }

  .m-conversation-time {
    white-space: nowrap;
    margin-left: auto;
    flex-shrink: 0;
    color: var(--foreground-700);
    font-size: 0.85rem;
    align-self: flex-start;
  }

  .m-conversation-avatar {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
  }

  .m-conversation-name {
    font-weight: 600;
    text-transform: capitalize;
    margin: 0;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .m-conversation-listing-link {
    margin-top: 2px;
    text-decoration: none;
    display: block;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--foreground-700);
  }

  &:hover {
    background-color: var(--primary-300);

    .m-last-message-content,
    .m-conversation-listing-link,
    .m-conversation-details,
    .m-conversation-avatar,
    .m-conversation-time {
      color: var(--monochrome-100);
    }
  }

  &.active {
    background-color: var(--primary-300);
    border-left: 3px solid var(--primary-400);
    color: var(--monochrome-100);
  }
}
</style>
