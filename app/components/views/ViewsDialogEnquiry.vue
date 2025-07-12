<template>
  <div class="| flow dialog-container dialog-container-xs">
    <h1 class="| title-xl">Send Enquiry</h1>
    <p class="| body-sm">Write your message or question below - we will notify them of your enquiry.</p>
    <div class="| flow flow-md">
      <textarea v-model="message" class="| body-sm" rows="4" placeholder="Type your message..."></textarea>
      <div class="| flex justify-end gap-2">
        <button class="| button button-ghost button-sm" type="button" @click="onClose" :disabled="sending">
          Cancel
        </button>
        <button class="| button button-primary button-sm" type="submit" @click="onSend" :disabled="sending || !message.trim()">
          {{ sending ? 'Sending...' : 'Send' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ receiverId: number }>();
const emit = defineEmits(['close', 'sent']);

const message = ref('');
const sending = ref(false);
const { sendEnquiry } = useEnquiry();

async function onSend() {
  if (!message.value.trim()) return;
  sending.value = true;
  try {
    await sendEnquiry(props.receiverId, message.value.trim());
    emit('sent');
    emit('close');
  } catch (e) {
    // Optionally show error
  } finally {
    sending.value = false;
  }
}

function onClose() {
  emit('close');
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
