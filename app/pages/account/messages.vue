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
          :is-active="!!(activeConversation && activeConversation.id === conversation.id)"
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
          @send-reply="replyToActiveConversation"
          @user-typing="handleUserTyping"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWebSocket } from "@vueuse/core";
import type { ConversationWithUserAndMessages, MessageWithUser } from "~~/shared/types/conversation";
import type { NewMessageEvent, NewConversationEvent, TypingEvent, MessageReadEvent } from "~~/shared/types/websocket";
import { useWebSocketMessageHandler } from "~/composables/useWebSocketMessageHandler";

definePageMeta({
  middleware: ["authenticated"],
  title: "Messages",
  meta: [
    {
      name: "description",
      content: "View and manage your messages and conversations.",
    },
  ],
});

/**
 * State
 */
const { user } = useUserSession();
const message = ref("");
const activeConversation = ref<ConversationWithUserAndMessages | null>(null);
const { handleWebSocketMessage } = useWebSocketMessageHandler();
const activeChatRef = ref<{ scrollToBottom: () => void } | null>(null);

// Typing indicators state
const typingUsers = ref<Record<number, { userId: number; isTyping: boolean; timeoutId?: number }>>({});
const typingTimeoutDuration = 3000; // 3 seconds

// WebSocket connection
const config = useRuntimeConfig();
const { status, data, send } = useWebSocket(config.public.WS_BASE_URL + "/api/_ws/conversation");

// Debug WebSocket connection status
watch(status, (newStatus) => {
  if (newStatus === "CLOSED" || newStatus === "CONNECTING") {
    console.log("WebSocket status changed:", newStatus);
  }
});

// Debug incoming WebSocket data - only log when there are issues
watch(data, (newData) => {
  if (newData && !newData.includes("ping")) {
    // Only log non-ping messages for debugging
    console.log("WebSocket message received");
  }
});

/**
 * Computed properties
 */

// Check if any other user is typing in the active conversation
const isOtherUserTyping = computed(() => {
  if (!activeConversation.value || !user.value) return false;

  return Object.values(typingUsers.value).some((typingUser) => typingUser.isTyping && typingUser.userId !== user.value!.id);
});

/**
 * Typing notification with manual cancellation
 */
let typingTimeout: NodeJS.Timeout | null = null;

const sendTypingNotification = (isTyping: boolean) => {
  // Clear any existing timeout
  if (typingTimeout) {
    clearTimeout(typingTimeout);
    typingTimeout = null;
  }

  // If we're setting typing to true, debounce it
  if (isTyping) {
    typingTimeout = setTimeout(() => {
      if (activeConversation.value && user.value) {
        const otherUserId = getOtherUserId(activeConversation.value, user.value.id!);
        if (otherUserId) {
          const notification = {
            type: "typing",
            conversationId: activeConversation.value.id,
            toUserId: otherUserId,
            isTyping: true,
          };
          send(JSON.stringify(notification));
        }
      }
    }, 300);
  } else {
    // Send stop typing immediately
    if (activeConversation.value && user.value) {
      const otherUserId = getOtherUserId(activeConversation.value, user.value.id!);
      if (otherUserId) {
        const notification = {
          type: "typing",
          conversationId: activeConversation.value.id,
          toUserId: otherUserId,
          isTyping: false,
        };
        send(JSON.stringify(notification));
      }
    }
  }
};

/**
 * Get the other user ID in a conversation
 */
function getOtherUserId(conversation: ConversationWithUserAndMessages, currentUserId: number): number | null {
  if (conversation.sender.id === currentUserId) {
    return conversation.receiver.id;
  } else if (conversation.receiver.id === currentUserId) {
    return conversation.sender.id;
  }
  return null;
}

/**
 * Handle user typing events
 */
function handleUserTyping() {
  sendTypingNotification(true);
}

/**
 * Stop typing notification immediately
 */
function stopTyping() {
  // Clear any pending typing timeout
  if (typingTimeout) {
    clearTimeout(typingTimeout);
    typingTimeout = null;
  }
  // Send immediate stop typing notification
  sendTypingNotification(false);
}

/**
 * Fetch conversations
 */
const { data: conversations, refresh: refreshConversations } = useAsyncData<ConversationWithUserAndMessages[]>("conversations", () => useRequestFetch()<ConversationWithUserAndMessages[]>("/api/conversation/all"));

/**
 * Process incoming WebSocket messages with proper typing
 */
watchEffect(() => {
  const incomingRaw = data.value;
  if (incomingRaw) {
    handleWebSocketMessage(incomingRaw, {
      onNewMessage: (messageEvent: NewMessageEvent) => {
        // Add message to the appropriate conversation
        const conversation = conversations.value?.find((convo) => convo.id === messageEvent.data.conversationId);

        if (conversation) {
          // Check if message already exists to prevent duplicates
          const messageExists = conversation.messages.some((msg) => msg.id === messageEvent.data.message.id);

          if (!messageExists) {
            // Optimized approach: Update only the specific conversation
            // instead of recreating the entire array

            // 1. Create updated conversation object
            const updatedConversation = {
              ...conversation,
              messages: [...conversation.messages, messageEvent.data.message],
              updatedAt: new Date(messageEvent.timestamp),
            };

            // 2. Update the conversation in place (more efficient than findIndex)
            const conversationIndex = conversations.value!.findIndex((convo) => convo.id === messageEvent.data.conversationId);

            if (conversationIndex !== -1) {
              // 3. Update only the changed conversation
              conversations.value![conversationIndex] = updatedConversation;

              // 4. Optimized sorting: Only move to top if not already first
              if (conversationIndex !== 0) {
                // Remove from current position and add to front
                conversations.value!.splice(conversationIndex, 1);
                conversations.value!.unshift(updatedConversation);
              }

              // 5. Update activeConversation reference if needed
              if (activeConversation.value && activeConversation.value.id === messageEvent.data.conversationId) {
                activeConversation.value = updatedConversation;

                nextTick(() => {
                  activeChatRef.value?.scrollToBottom();
                });
              }
            }
          }
        }
      },

      onNewConversation: (conversationEvent: NewConversationEvent) => {
        // Add new conversation to the list and refresh to ensure proper reactivity
        if (conversations.value) {
          conversations.value.unshift(conversationEvent.data.conversation);
          refreshConversations();
        }
      },

      onTyping: (typingEvent: TypingEvent) => {
        const { conversationId, isTyping, userId } = typingEvent.data;
        if (activeConversation.value && activeConversation.value.id === conversationId) {
          // Update local typing indicator state
          if (isTyping) {
            typingUsers.value[userId] = { userId, isTyping };
          } else {
            delete typingUsers.value[userId];
          }

          // Remove typing indicator after timeout as fallback
          if (isTyping) {
            setTimeout(() => {
              delete typingUsers.value[userId];
            }, typingTimeoutDuration);
          }
        }
      },

      onMessageRead: (readEvent: MessageReadEvent) => {
        // Read receipt functionality removed
      },
    });
  }
});

/**
 * Set the active conversation to display its messages
 */
function setActiveConversation(conversation: ConversationWithUserAndMessages) {
  activeConversation.value = conversation;
  message.value = "";

  // Scroll to bottom when switching conversations
  nextTick(() => {
    activeChatRef.value?.scrollToBottom();
  });
}

/**
 * Reply to the active conversation
 */
async function replyToActiveConversation() {
  // Stop typing indicator immediately to prevent any interference
  stopTyping();

  if (!activeConversation.value || !message.value.trim()) {
    return;
  }

  // Check WebSocket connection status
  if (status.value !== "OPEN") {
    console.error("WebSocket connection not open:", status.value);
    return;
  }

  const conversationId = activeConversation.value.id;
  const content = message.value;

  try {
    const response = await $fetch<MessageWithUser>("/api/conversation/reply", {
      method: "POST",
      body: {
        message: content,
        conversationId,
      },
    });

    // Clear the message input immediately for better UX
    message.value = "";

    // Note: The message will be added to UI via WebSocket broadcast
    // This prevents double messages on sender side
  } catch (err) {
    console.error("Error sending reply:", err);
  }
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
