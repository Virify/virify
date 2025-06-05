<template>
  <div class="p-messages | container">
    <h1 class="| title-md">Messages</h1>
    <div class="p-messages-layout">
      <!-- Left Column: Conversations List -->
      <ul class="p-conversations-column">
        <MoleculesConversationListItem
          v-for="conversation in conversations"
          :key="conversation.id"
          :conversation="conversation"
          :current-user-id="user?.id"
          :is-active="activeConversation?.id === conversation.id"
          @select-conversation="setActiveConversation"
        />
      </ul>

      <!-- Right Column: Active Conversation Messages -->
      <div class="p-active-chat-column">
        <OrganismsActiveChat
          ref="activeChatRef"
          :conversation="activeConversation"
          :current-user-id="user?.id"
          v-model:reply-message="message"
          :is-send-disabled="status !== 'OPEN'"
          :is-typing="isOtherUserTyping"
          @send-reply="sendReply"
          @user-typing="handleUserTyping"
        />
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

// Typing state
const typingUsers = ref<Record<number, boolean>>({});
let typingTimeout: NodeJS.Timeout | null = null;

// WebSocket connection
const config = useRuntimeConfig();
const { status, data, send } = useWebSocket(config.public.WS_BASE_URL + "/api/_ws/connection");

// WebSocket composable
const { createTypingMessage, handleIncomingMessage } = useWebSocketServer();

// Fetch conversations with secure session handling
const conversationsData = await useRequestFetch()<ConversationWithUserAndMessages[]>("/api/conversation/");
const conversations = ref<ConversationWithUserAndMessages[]>(conversationsData || []);

// Computed: Check if other user is typing
const isOtherUserTyping = computed(() => {
  if (!user.value) return false;
  return Object.entries(typingUsers.value).some(([userId, isTyping]) => isTyping && Number(userId) !== user.value!.id);
});

// Define WebSocket event handlers
const webSocketEvents: WebSocketEvents = {
  onNewMessage: ({ conversationId, message: newMessage }) => {
    console.log("📨 New message received:", { conversationId, message: newMessage });
    console.log("👤 Current user ID:", user.value?.id);
    console.log("📧 Message sender ID:", newMessage.senderId);

    if (!conversations.value || !user.value) return;

    const conversation = conversations.value.find((c: ConversationWithUserAndMessages) => c.id === conversationId);
    if (!conversation) {
      console.log("❌ Conversation not found:", conversationId);
      return;
    }

    // Check for duplicates
    if (conversation.messages.some((m: MessageWithUser) => m.id === newMessage.id)) {
      console.log("⚠️ Duplicate message detected, skipping");
      return;
    }

    // Add message directly
    conversation.messages.push(newMessage);
    conversation.updatedAt = new Date();

    // Move conversation to top
    const index = conversations.value.indexOf(conversation);
    if (index > 0) {
      conversations.value.splice(index, 1);
      conversations.value.unshift(conversation);
    }

    // Force reactivity update for receiver UI
    triggerRef(conversations);

    // Scroll if active conversation
    if (activeConversation.value?.id === conversationId) {
      nextTick(() => activeChatRef.value?.scrollToBottom());
    }

    console.log("✅ Message added successfully");
  },

  onNewConversation: ({ conversation }) => {
    console.log("🆕 New conversation received:", conversation);
    if (conversations.value) {
      conversations.value.unshift(conversation);
    }
  },

  onTyping: ({ from, conversationId, isTyping }) => {
    console.log("⌨️ Typing received:", { from, conversationId, isTyping });

    if (!activeConversation.value || activeConversation.value.id !== conversationId) return;

    if (isTyping) {
      typingUsers.value[from] = true;
      // Clear after 3 seconds
      setTimeout(() => {
        delete typingUsers.value[from];
      }, 3000);
    } else {
      delete typingUsers.value[from];
    }
  },

  onMessageRead: ({ from, conversationId, messageId }) => {
    console.log("📖 Message read received:", { from, conversationId, messageId });
    // Handle message read status if needed
  },
};

// Watch WebSocket status for debugging
watch(status, (newStatus) => {
  console.log("🔌 WebSocket status changed:", newStatus);
});

// Watch WebSocket data and handle through composable
watchEffect(() => {
  if (data.value) {
    handleIncomingMessage(data.value, webSocketEvents);
  }
});

// Set active conversation
function setActiveConversation(conversation: ConversationWithUserAndMessages) {
  activeConversation.value = conversation;
  message.value = "";
  nextTick(() => activeChatRef.value?.scrollToBottom());
}

// Send message with optimistic update
async function sendReply() {
  if (!activeConversation.value || !message.value.trim() || status.value !== "OPEN" || !user.value) {
    return;
  }

  const content = message.value;
  const conversationId = activeConversation.value.id;

  // Clear input and stop typing
  message.value = "";
  sendTypingStatus(false);

  // Optimistic update - add message immediately for sender
  const optimisticMessage: MessageWithUser = {
    id: Date.now(), // Temporary ID
    senderId: user.value.id!,
    receiverId: getOtherUserId(activeConversation.value, user.value.id!)!,
    content,
    createdAt: new Date(),
    updatedAt: new Date(),
    sender: {
      id: user.value.id!,
      username: user.value.username || null,
      email: user.value.email,
    },
    receiver: activeConversation.value.sender.id === user.value.id ? activeConversation.value.receiver : activeConversation.value.sender,
  };

  // Add to conversation immediately
  activeConversation.value.messages.push(optimisticMessage);
  activeConversation.value.updatedAt = new Date();

  // Move conversation to top
  const conversationIndex = conversations.value?.findIndex((c: ConversationWithUserAndMessages) => c.id === conversationId) ?? -1;
  if (conversationIndex > 0 && conversations.value) {
    conversations.value.splice(conversationIndex, 1);
    conversations.value.unshift(activeConversation.value);
  }

  // Scroll to bottom
  nextTick(() => activeChatRef.value?.scrollToBottom());

  try {
    // Send to server - this will broadcast to the receiver via WebSocket
    console.log("🚀 CLIENT: About to send message to API:", { content, conversationId });

    const serverMessage = await $fetch<MessageWithUser>("/api/conversation/reply/", {
      method: "POST",
      body: { message: content, conversationId },
    });

    console.log("✅ CLIENT: API response received:", serverMessage);

    // Replace optimistic message with server response
    const messageIndex = activeConversation.value.messages.findIndex((m: MessageWithUser) => m.id === optimisticMessage.id);
    if (messageIndex !== -1) {
      activeConversation.value.messages[messageIndex] = serverMessage;
    }
  } catch (error) {
    console.error("❌ CLIENT: Error sending message:", error);

    // Remove optimistic message on error
    const messageIndex = activeConversation.value.messages.findIndex((m: MessageWithUser) => m.id === optimisticMessage.id);
    if (messageIndex !== -1) {
      activeConversation.value.messages.splice(messageIndex, 1);
    }

    // Restore message
    message.value = content;
  }
}

// Typing handlers
function handleUserTyping() {
  sendTypingStatus(true);
}

function sendTypingStatus(isTyping: boolean) {
  if (!activeConversation.value || !user.value) return;

  // Clear existing timeout
  if (typingTimeout) {
    clearTimeout(typingTimeout);
    typingTimeout = null;
  }

  const otherUserId = getOtherUserId(activeConversation.value, user.value.id!);
  if (!otherUserId) return;

  if (isTyping) {
    // Debounce typing
    typingTimeout = setTimeout(() => {
      const typingMessage = createTypingMessage(activeConversation.value!.id, otherUserId, true);
      send(JSON.stringify(typingMessage));
    }, 300);
  } else {
    // Send stop typing immediately
    const typingMessage = createTypingMessage(activeConversation.value.id, otherUserId, false);
    send(JSON.stringify(typingMessage));
  }
}

// Utility: Get other user ID in conversation
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
