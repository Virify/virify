<template>
  <div class="websocket-test-page">
    <h1>WebSocket Conversation Test Page</h1>
    <div>
      <input v-model="input" @keyup.enter="sendMessage" placeholder="Type a message and press Enter" />
      <button @click="sendMessage">Send</button>
    </div>
    <div style="margin-top:1em;">
      <strong>Status:</strong> {{ status }}
    </div>
    <div style="margin-top:1em;">
      <strong>Messages:</strong>
      <ul>
        <li v-for="(msg, i) in messages" :key="i">{{ msg }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const wsUrl = 'ws://localhost:3000/api/_ws/conversation';
const ws = ref<WebSocket | null>(null);
const status = ref('Disconnected');
const input = ref('');
const messages = ref<string[]>([]);

function sendMessage() {
  if (ws.value && ws.value.readyState === WebSocket.OPEN && input.value) {
    ws.value.send(input.value);
    messages.value.push('You: ' + input.value);
    input.value = '';
  }
}

onMounted(() => {
  ws.value = new WebSocket(wsUrl);
  ws.value.onopen = () => {
    status.value = 'Connected';
    messages.value.push('WebSocket connected');
  };
  ws.value.onmessage = (event) => {
    messages.value.push('Server: ' + event.data);
  };
  ws.value.onclose = () => {
    status.value = 'Disconnected';
    messages.value.push('WebSocket disconnected');
  };
  ws.value.onerror = (err) => {
    console.log('WebSocket error:', err);
    status.value = 'Error';
    messages.value.push('WebSocket error');
  };
});

onBeforeUnmount(() => {
  if (ws.value) ws.value.close();
});
</script>

<style scoped>
.websocket-test-page input {
  padding: 0.5em;
  font-size: 1em;
}
.websocket-test-page button {
  margin-left: 0.5em;
  padding: 0.5em 1em;
}
.websocket-test-page ul {
  list-style: disc;
  margin-left: 1.5em;
}
</style>
