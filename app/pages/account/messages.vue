<template>
  <div class="p-messages | container">
    <h1 class="| title-md">Messages</h1>
    <div class="">
      <MoleculesFormField label="Search">
        <input v-model="conversationsSearch" class="| text-input focus-visible" name="Search"
          placeholder="Search conversations..." />
      </MoleculesFormField>
      
    </div>
    <AtomsDivider />
    <div class="p-messages-layout">
      <!-- Left Column: Conversations List -->
      <ul class="p-conversations-column">
        <MoleculesConversationListItem v-for="conversation in searchedConversations" :key="conversation.id"
          :conversation="conversation" :current-user-id="user?.id"
          :is-active="activeConversation?.id === conversation.id" @select-conversation="setActiveConversation" />
      </ul>

      <!-- Right Column: Active Conversation Messages -->
      <div class="p-active-chat-column">
        <OrganismsActiveChat ref="activeChatRef" :conversation="activeConversation" :current-user-id="user?.id"
          v-model:reply-message="message" :is-send-disabled="status !== 'OPEN'" :is-typing="isOtherUserTyping"
          @send-reply="sendReply" @user-typing="handleUserTyping" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWebSocket } from "@vueuse/core";
import type { ConversationWithUserAndMessages, MessageWithUser } from "~~/shared/types/conversation";
import { useWebSocketServer, type WebSocketEvents } from "~~/layers/websocket/composables/useWebSocketServer";

definePageMeta({
  middleware: ["authenticated"],
  title: "Messages",
});

// User and basic state
const { user } = useUserSession();
const message = ref("");
const activeConversation = ref<ConversationWithUserAndMessages | null>(null);
const activeChatRef = ref<{ scrollToBottom: () => void } | null>(null);
const conversationsSearch = ref("");

/**
 * Computed property to filter conversations based on search input
 */
const searchedConversations = computed(() => {
  if (!conversations.value) return [];
  const searchTerm = conversationsSearch.value.toLowerCase();
  return conversations.value.filter((conversation: ConversationWithUserAndMessages) => {
    return (
      conversation.sender.email.toLowerCase().includes(searchTerm) ||
      conversation.receiver.email.toLowerCase().includes(searchTerm) ||
      conversation.sender?.username?.toLowerCase().includes(searchTerm) ||
      conversation.receiver?.username?.toLowerCase().includes(searchTerm) ||
      conversation.listing?.property?.address?.fullAddress?.toLowerCase().includes(searchTerm) ||
      conversation.messages.some((message: MessageWithUser) =>
        message.content.toLowerCase().includes(searchTerm)
      )
    );
  });
});

// Typing state
const typingUsers = ref<Record<number, boolean>>({});
let typingTimeout: NodeJS.Timeout | null = null;

// WebSocket connection
const config = useRuntimeConfig();
const { status, data, send } = useWebSocket(config.public.WS_BASE_URL + "/api/_ws/connection");

// WebSocket composable
const { createTypingMessage, handleOutgoingMessages } = useWebSocketServer();

// Fetch conversations with secure session handling
const conversationsData = await useRequestFetch()<ConversationWithUserAndMessages[]>("/api/conversation/");
const conversations = ref<ConversationWithUserAndMessages[]>(conversationsData || []);

/**
 * WebSocket event handlers - Called when WebSocket messages are received
 * These handle real-time updates to the chat interface
 */
const webSocketEvents: WebSocketEvents = {
  /**
   * Handles incoming new message events from all participants
   * Updates the conversation and moves it to the top of the list
   * @param conversationId - ID of the conversation the message belongs to
   * @param message - The new message object from the server
   */
  onNewMessage: ({ conversationId, message: newMessage }) => {
    if (!conversations.value || !user.value) return;

    const conversation = conversations.value.find((c: ConversationWithUserAndMessages) => c.id === conversationId);
    if (!conversation) return;

    // Prevent duplicate messages
    if (conversation.messages.some((m: MessageWithUser) => m.id === newMessage.id)) return;

    // Add message and update conversation timestamp
    conversation.messages.push(newMessage);
    conversation.updatedAt = new Date();

    // Move conversation to top of list and trigger reactivity
    const index = conversations.value.indexOf(conversation);
    if (index > 0) {
      conversations.value.splice(index, 1);
      conversations.value.unshift(conversation);
    }
    triggerRef(conversations);

    // Auto-scroll to new message if this conversation is active
    if (activeConversation.value?.id === conversationId) {
      nextTick(() => activeChatRef.value?.scrollToBottom());
    }
  },

  /**
   * Handles new conversation creation events
   * Adds the new conversation to the top of the conversations list
   * @param conversation - The new conversation object
   */
  onNewConversation: ({ conversation }) => {
    if (conversations.value) {
      conversations.value.unshift(conversation);
    }
  },

  /**
   * Handles typing indicator events from other users
   * Shows/hides "user is typing" indicators in the active conversation
   * @param from - User ID who is typing
   * @param conversationId - ID of the conversation where typing is happening
   * @param isTyping - Whether the user is currently typing
   */
  onTyping: ({ from, conversationId, isTyping }) => {
    if (!activeConversation.value || activeConversation.value.id !== conversationId) return;

    if (isTyping) {
      typingUsers.value[from] = true;
      // Auto-clear typing indicator after 3 seconds
      setTimeout(() => delete typingUsers.value[from], 3000);
    } else {
      delete typingUsers.value[from];
    }
  },

  /**
   * Handles message read status events
   * Updates message read receipts and status indicators
   * @param from - User ID who read the message
   * @param conversationId - ID of the conversation
   * @param messageId - ID of the message that was read
   */
  onMessageRead: ({ from, conversationId, messageId }) => {
    // TODO: Implement read receipt functionality
  },
};

/**
 * Computed property to check if another user is currently typing
 * Excludes the current user from typing indicators
 */
const isOtherUserTyping = computed(() => {
  if (!user.value) return false;
  return Object.entries(typingUsers.value).some(([userId, isTyping]) => isTyping && Number(userId) !== user.value!.id);
});

/**
 * Watch WebSocket data and route messages through the composable's event handler
 */
watchEffect(() => {
  if (data.value) {
    handleOutgoingMessages(data.value, webSocketEvents);
  }
});

/**
 * Sets the active conversation and resets the input field
 * @param conversation - The conversation to make active
 */
function setActiveConversation(conversation: ConversationWithUserAndMessages) {
  activeConversation.value = conversation;
  message.value = "";
  nextTick(() => activeChatRef.value?.scrollToBottom());
}

/**
 * Sends a reply message and lets WebSocket handle UI updates
 * Server will broadcast the message to all participants (including sender)
 * The onNewMessage event handler will update the UI when the message comes back
 */
async function sendReply() {
  if (!activeConversation.value || !message.value.trim() || status.value !== "OPEN" || !user.value) {
    return;
  }

  const content = message.value;
  const conversationId = activeConversation.value.id;

  // Clear input and stop typing indicator
  message.value = "";
  sendTypingStatus(false);

  try {
    // Send message to server (will broadcast to all participants via WebSocket)
    await $fetch<MessageWithUser>("/api/conversation/reply/", {
      method: "POST",
      body: { message: content, conversationId },
    });

    // UI will be updated automatically when WebSocket receives the message
  } catch (error) {
    console.error("Error sending message:", error);

    // Restore original message content for retry
    message.value = content;
  }
}

/**
 * Handles user typing events from the input field
 * Triggers typing status broadcast to other users
 */
function handleUserTyping() {
  sendTypingStatus(true);
}

/**
 * Sends typing status to other users in the conversation
 * Debounces typing start events and immediately sends stop events
 * @param isTyping - Whether the user is currently typing
 */
function sendTypingStatus(isTyping: boolean) {
  if (!activeConversation.value || !user.value) return;

  // Clear any existing typing timeout
  if (typingTimeout) {
    clearTimeout(typingTimeout);
    typingTimeout = null;
  }

  const otherUserId = getOtherUserId(activeConversation.value, user.value.id!);
  if (!otherUserId) return;

  if (isTyping) {
    // Debounce typing start to avoid spam
    typingTimeout = setTimeout(() => {
      const typingMessage = createTypingMessage(activeConversation.value!.id, otherUserId, true);
      send(JSON.stringify(typingMessage));
    }, 300);
  } else {
    // Send stop typing immediately for responsive UX
    const typingMessage = createTypingMessage(activeConversation.value.id, otherUserId, false);
    send(JSON.stringify(typingMessage));
  }
}

/**
 * Gets the other user's ID in a conversation (not the current user)
 * @param conversation - The conversation object
 * @param currentUserId - The current user's ID
 * @returns The other user's ID, or null if not found
 */
function getOtherUserId(conversation: ConversationWithUserAndMessages, currentUserId: number): number | null {
  return conversation.sender.id === currentUserId ? conversation.receiver.id : conversation.sender.id;
}
</script>

<style lang="scss" scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;

  li {
    padding: 12px;
  }
}

.p-messages {
  margin-top: -3rem;
}

.p-messages-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  height: calc(100vh - 244px);

  @media (min-width: 768px) {
    grid-template-columns: 1fr 3fr;
  }
}

.p-conversations-column {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
  height: 100%;
}

.p-active-chat-column {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
