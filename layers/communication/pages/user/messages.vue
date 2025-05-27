<template>
  <div class="p-messages | container">
    <h1 class="| title-md">Messages</h1>
    <div class="p-messages-layout">
      <!-- Left Column: Conversations List -->
      <ul class="p-conversations-column">
        <MoleculesConversationListItem v-for="conversation in conversations"
          :key="conversation.id"
          :conversation="conversation" 
          :current-user-id="user?.id"
          :is-active="!!(activeConversation && activeConversation.id === conversation.id)"
          @select-conversation="setActiveConversation" />
      </ul>

      <!-- Right Column: Active Conversation Messages -->
      <div class="p-active-chat-column">
        <OrganismsActiveChat 
          :conversation="activeConversation" 
          :current-user-id="user?.id"
          v-model:reply-message="message" 
          :is-send-disabled="status !== 'OPEN'"
          @send-reply="replyToActiveConversation" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type ConversationWithUserAndMessages, type MessageWithUser } from '~~/shared/types/conversation'
import { useWebSocket } from '@vueuse/core'
import { parseWebSocketMessage, processIncomingMessage, type MessageHandlerResult } from '../../utils/websocket';
const config = useRuntimeConfig();

/**
 * State
 */
const { user } = useUserSession()
const message = ref('')
const status = ref('DISCONNECTED')
const conversations = ref<ConversationWithUserAndMessages[]>([])
const activeConversation = ref<ConversationWithUserAndMessages | null>(null)
// Removed activeMessagesListRef as scrolling is handled by ActiveChat.vue

let send = (_msg: string) => { }
let open = () => { }
let close = () => { }

if (import.meta.client) {
  const socket = useWebSocket(config.public.WS_BASE_URL + '/api/_ws/conversation', {
    autoConnect: true,
    immediate: true,
    autoClose: false,
    autoReconnect: {
      retries: 3,
      delay: 1000,
      onFailed() {
        console.warn('Failed to reconnect after 3 attempts.')
      },
    },
  })

  /**
   * When we get a message from the WebSocket we update the specific conversation
   */
  watchEffect(() => {
    status.value = socket.status.value
    const incomingRaw = socket.data.value
    if (incomingRaw) {
      console.log('Incoming raw message from WS:', incomingRaw)
      // parse the incoming message
      const parsedMessage = parseWebSocketMessage(incomingRaw)
      // process the parsed message
      const result = processIncomingMessage(parsedMessage)
      // do things with the processed message
      handleProcessedMessage(result)
    }
  })

  send = (msg: string) => {
    socket.send(msg)
  }

  open = socket.open
  close = socket.close
}

/**
 * Set the active conversation to display its messages
 * 
 * @param conversation - The conversation object to set as active
 */
function setActiveConversation(conversation: ConversationWithUserAndMessages) {
  activeConversation.value = conversation
  message.value = ''
  console.log('Active conversation set:', activeConversation.value);
}

/**
 * Handle the processed message result from the utility function
 * to update the component's state.
 *
 * @param result - The result object from processIncomingMessage
 */
const handleProcessedMessage = (result: MessageHandlerResult) => {
  console.log('Handling processed message result in component:', result);

  switch (result.action) {
    case 'USER_TYPING':
      // Handle typing indicators
      console.log('User is typing:', result.payload, 'in conversation:', result.conversationId);
      // TODO: Implement typing indicator UI
      break;
    case 'MESSAGE_READ':
      // Handle read receipts
      console.log('Message read:', result.payload, 'in conversation:', result.conversationId);
      // TODO: Implement read receipt UI update
      break;
    case 'ADD_CONVERSATION':
      if (result.conversationId && result.payload) {
        console.log('Adding new conversation to component state:', result.conversationId);
        conversations.value.unshift(result.payload as ConversationWithUserAndMessages);
      } else {
        console.warn('ADD_CONVERSATION action missing conversationId or payload:', result);
      }
      break;
    case 'ADD_MESSAGE_TO_CONVERSATION':
      if (result.conversationId && result.payload) {
        console.log('Updating conversation in component state with new message:', result.conversationId);
        updateConversationWithMessage({
          conversationId: result.conversationId,
          messageData: result.payload as MessageWithUser
        });
      } else {
        console.warn('ADD_MESSAGE_TO_CONVERSATION action missing conversationId or payload:', result);
      }
      break;
    case 'UNKNOWN_MESSAGE':
      console.log('Unknown or unhandled message type in component:', result.payload);
      break;
    case 'NO_ACTION':
      console.log('No action to take for message:', result.originalMessage);
      break;
    default:
      console.log('Unhandled action type in component:', result.action);
      break;
  }
};

/**
 * Update a specific conversation with a new message
 * 
 * @param messageData - The complete message data
 */
const updateConversationWithMessage = (messageData: any) => {
  const conversation = conversations.value.find(convo => String(convo.id) === String(messageData.conversationId))
  if (conversation) {
    console.log('Found conversation, adding message:', messageData.messageData)
    conversation.messages.push(messageData.messageData)
  } else {
    console.log('Conversation not found, ID:', messageData.conversationId)
  }
}

/**
 * Fetch conversations
 */
const fetchConversations = async () => {
  try {
    const data = await $fetch<ConversationWithUserAndMessages[]>('/api/conversation/all/user/all')
    if (data) {
      conversations.value = data
      message.value = ''
      console.log('Conversations fetched:', conversations.value)
    } else {
      console.error('No conversations found')
    }
  } catch (err) {
    console.error('Error fetching conversations:', err)
  }
}

/**
 * Fetch listing data for test enquiry button
 * Fetch conversations
 */
onMounted(() => {
  fetchConversations()
})

/**
 * Reply to the active message in a conversation
 */
async function replyToActiveConversation() {
  if (!activeConversation.value || !message.value.trim()) {
    console.log('No active conversation or message is empty')
    return
  }

  const conversationId = activeConversation.value.id
  const content = message.value

  console.log('Replying to message:', {
    conversationId,
    message: content,
  })

  try {
    const response = await $fetch<MessageWithUser>('/api/conversation/reply', {
      method: 'POST',
      body: {
        message: content,
        conversationId,
      },
    })

    // Add the message to the sender's active conversation UI immediately
    if (activeConversation.value && activeConversation.value.id === conversationId) {
      activeConversation.value.messages.push(response);
    }

    // Prepare message for WebSocket to notify other participants
    const messageToSend = {
      to: response.receiverId,
      message: content,
      conversationId: conversationId,
      messageData: response
    }

    send(JSON.stringify(messageToSend))
    message.value = ''
  } catch (err) {
    console.error('Error sending reply:', err)
  }
}
</script>

<style lang="scss" scoped>
p-messages div {
  margin-bottom: 0.75em;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;

  li {
    padding: 12px;
  }
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
