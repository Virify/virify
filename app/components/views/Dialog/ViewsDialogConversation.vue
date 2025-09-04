<template>
  <div class="| flow dialog-container dialog-container-xs">
    <h1 class="| title-xl">Start Conversation</h1>
    <p class="| body-sm">Write your message or question below - we will notify them of your message.</p>
    <div class="| flow flow-md">
      <textarea v-model="message" class="| body-sm" rows="4" placeholder="Type your message..."></textarea>
      <div class="| flex justify-end gap-2">
        <button class="| button button-ghost button-sm" type="button" @click="onClose" :disabled="sending">
          Cancel
        </button>
        <button class="| button button-secondary button-sm" type="submit" @click="onSend" :disabled="sending || !message.trim()">
          {{ sending ? 'Sending...' : 'Send' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ listingId: number; receiverId: number }>();

const message = ref('');
const sending = ref(false);
const { startConversation } = useConversations();
const { hideDialog } = useDialog();
const { showToast } = useToast();

async function onSend() {
  if (!message.value.trim()) return;
  sending.value = true;
  try {
    await startConversation(props.listingId, props.receiverId, message.value.trim());
    showToast('Message sent successfully!', { type: 'success' });
    hideDialog();
  } catch (e) {
    showToast('Failed to send message. Please try again.', { type: 'error' });
    console.error('Error starting conversation:', e);
  } finally {
    sending.value = false;
  }
}

function onClose() {
  hideDialog();
}
</script>

<style scoped>
textarea {
  width: 100%;
  padding: var(--size-12);
  border: 1px solid var(--background-300);
  border-radius: var(--border-radius-lg);
  background: var(--background-200);
  resize: vertical;
  font-size: 1rem;
}
</style>
