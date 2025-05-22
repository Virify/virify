<template>
  <div class="websocket-test-page">
    <h1>VueUse WebSocket Chat</h1>

    <button @click="sendEnquiry" class="button button-sm">TEST ENQUIRY BUTTON</button>

    <ClientOnly>
      <div>Status: {{ status }}</div>
      <div>
        <label for="message">Send Message:</label>
        <input type="text" id="message" v-model="message" />
        <button @click="send(message)" :disabled="status !== 'OPEN'">Send</button>
      </div>

      <hr />

      <ul>
        <li v-for="(msg, idx) in messages" :key="idx">{{ msg }}</li>
      </ul>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'

const message = ref('')
const messages = ref<string[]>([])
const status = ref('DISCONNECTED')
const listing = ref<ListingWithFullProperty>()

let send = (_msg: string) => { }
let open = () => { }
let close = () => { }

if (import.meta.client) {
  const socket = useWebSocket('ws://localhost:3000/api/_ws/conversation', {
    autoConnect: true,
    immediate: true,
    autoClose: false,
    heartbeat: {
      message: JSON.stringify({ type: 'ping' }),
      interval: 30000,
      pongTimeout: 10000,
    },
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

/**
 * Fetch listing data for test enquiry button
 */
await $fetch('/api/listing/1')
  .then((data) => {
    if (data) {
      listing.value = data as unknown as ListingWithFullProperty
      console.log('Listing fetched:', listing.value)
    } else {
      console.error('No listing found')
    }
  })
  .catch((err) => {
    console.error('Error fetching listing:', err)
    return null
  })

/**
 * Send enquiry
 * Create a conversation if it doesn't exist
 * Update the conversation if it does exist
 */
async function sendEnquiry() {
  const listingId = listing.value?.id
  const receiverId = listing.value?.userId
  const message = await $fetch('/api/conversation/create-or-update', {
    method: 'POST',
    body: {
      listingId,
      receiverId,
      message: 'Hello, I am interested in this listing.',
    },
  })
  console.log('Enquiry sent:', message)
}
</script>


<style scoped>
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

.websocket-test-page ul {
  list-style-type: none;
  padding-left: 0;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
}

.websocket-test-page li {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.websocket-test-page li:last-child {
  border-bottom: none;
}

hr {
  margin: 1.5em 0;
}
</style>
