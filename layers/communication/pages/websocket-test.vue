<template>
  <div class="| container">
    <p class="| body-md">Enter a question or request further details below to enquire about this listing.</p>
    <textarea type="text" v-model="enquiryMessage" placeholder="Can I get more information on this property please?"
      class="border" />
    <button @click="sendEnquiry" class="button button-sm">TEST ENQUIRY BUTTON</button>
    <AtomsDivider />
    <h1 class="title-md">Enquiries</h1>
    <!-- websocket log -->
    <!-- <ClientOnly>
      <p class="| body-md">WebSocket Log</p>
      <ul>
        <li v-for="(msg, idx) in messages" :key="idx">{{ msg }}</li>
      </ul>
    </ClientOnly> -->

    <!-- conversations container -->
    <div class="pt-6 flex flex-col gap-2">
      <ul class="flex flex-col gap-2">
        <!-- conversations -->
        <li v-for="(conversation, index) in conversations" :key="index" class="flex flex-col gap-2 p-6">
          <strong>Enquiry {{ conversationPoV(conversation) }}:</strong>
          <ul>
            <!-- messages in a conversation -->
            <li v-for="(convoMessage, msgIndex) in conversation.messages" :key="msgIndex"
              :class="convoMessagePoV(convoMessage) === 'You' ? 'message-sender' : 'message-receiver'">
              <p class="text-sm text-gray-500">
                {{ messageFormattedTime(convoMessage.createdAt) }}
              </p>
              <strong>{{ convoMessagePoV(convoMessage) }}</strong>:<br> {{ convoMessage.content }}
            </li>
            <!-- reply to message -->
            <div class="flex flex-row gap-2 justify-between">
              <input type="text" v-model="message" />
              <!-- TODO Figure out logic for receiver vs sender the receiver will always be the opposite of the sender -->
              <button @click="replyToMessage(conversation.id, conversation.sender.id, conversation.receiver.id, message)"
                :disabled="status !== 'OPEN'" class="| button">Reply</button>
            </div>

          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'
import type { ListingWithFullProperty } from '~~/shared/types/listing'
const { user } = useUserSession()
const message = ref('')
const messages = ref<string[]>([])
const status = ref('DISCONNECTED')
const listing = ref<ListingWithFullProperty | null>(null)

let send = (_msg: string) => { }
let open = () => { }
let close = () => { }

if (import.meta.client) {
  const socket = useWebSocket('ws://localhost:3000/api/_ws/conversation', {
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

  watchEffect(() => {
    status.value = socket.status.value

    const incoming = socket.data.value
    if (incoming) {
      messages.value.push(`Received: ${incoming}`)
      // on receiving a message, fetch conversations
      // TODO: Need fetch the messages frmo the conversation updating NOT ALL conversations every time.
      fetchConversations()
    }
  })

  send = (msg: string) => {
    if (!msg.trim()) return

    socket.send(msg)
    messages.value.push(`Sent: ${msg}`)
    message.value = ''
  }

  open = socket.open
  close = socket.close
}

// Import the conversation type
import type { ConversationWithUserAndMessages } from '~~/shared/types/conversation'
const conversations = ref<ConversationWithUserAndMessages[]>([])
const enquiryMessage = ref('')

const conversationPoV = (conversation: any) => {
  if (conversation.sender.id === user.value?.id) {
    return conversation.receiver.email
  } else {
    return conversation.sender.email
  }
}

const convoMessagePoV = (convoMessage: any) => {
  if (convoMessage.sender.id === user.value?.id) {
    return 'You'
  } else {
    return convoMessage.sender.email
  }
}

const messageFormattedTime = (createdAt: any) => {
  // if the day is today, show time only
  const date = new Date(createdAt)
  return date.toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Fetch conversations
 */
const fetchConversations = async () => {
  try {
    const data = await $fetch<ConversationWithUserAndMessages[]>('/api/conversation/all/user/all')
    if (data) {
      conversations.value = data
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
 */
const fetchListing = async () => {
  try {
    const data = await $fetch('/api/listing/1')
    if (data) {
      listing.value = data as unknown as ListingWithFullProperty
      console.log('Listing fetched:', listing.value)
    } else {
      console.error('No listing found')
    }
  } catch (err) {
    console.error('Error fetching listing:', err)
  }
}

// Wrap in onMounted to ensure it only runs on the client side
onMounted(() => {
  fetchListing()
  fetchConversations()
})

/**
 * Send enquiry
 * Create a conversation if it doesn't exist
 * Update the conversation if it does exist
 */
async function sendEnquiry() {
  if (!listing.value) {
    console.error('No listing data available')
    return
  }

  const listingId = listing.value.id
  const receiverId = listing.value.userId

  try {
    const response = await $fetch('/api/conversation/create', {
      method: 'POST',
      body: {
        listingId,
        receiverId,
        message: enquiryMessage.value,
      },
    })
    console.log('Enquiry sent:', response)
    send(enquiryMessage.value)
    enquiryMessage.value = ''
  } catch (err) {
    console.error('Error sending enquiry:', err)
  }
}

/**
 * Reply to a message in a conversation
 * 
 * @param conversationId - The ID of the conversation
 * @param receiverId - The ID of the receiver
 * @param message - The message to send
 */
async function replyToMessage(conversationId: number, receiverId: number, senderId: number, message: string) {
  console.log('Replying to message:', {
    conversationId,
    receiverId,
    senderId,
    message,
  })
  
  try {
    const response = await $fetch('/api/conversation/reply', {
      method: 'POST',
      body: {
        message,
        conversationId,
        receiverId,
      },
    })
    console.log('Reply sent:', response)
    send(String(message))
    fetchConversations()
  } catch (err) {
    console.error('Error sending reply:', err)
  }
}
</script>


<style lang="scss" scoped>
.websocket-test-page div {
  margin-bottom: 0.75em;
}

.websocket-test-page label {
  margin-right: 0.5em;
  display: inline-block;
  min-width: 120px;
}

.websocket-test-page input {
  padding: 0.5em;
  font-size: 1em;
  margin-right: 0.5em;
  min-width: 200px;
}

.websocket-test-page button {
  margin-left: 0.5em;
  padding: 0.5em 1em;
  cursor: pointer;
}

.websocket-test-page button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;

  li {
    margin-bottom: 0.5em;
    padding: 12px;
  }
}

input {
  width: 90%;
  padding: 12px;
  border-radius: 5px;
  border: 1px solid var(--foreground-200);
}

.message-sender {
  border: 1px solid var(--secondary-300);
  width: 60%;
  padding: 20px;
  border-radius: 5px;
}

.message-receiver {
  border: 1px solid var(--primary-300);
  width: 60%;
  margin-left: auto;
  padding: 20px;
  border-radius: 5px;
}
</style>
