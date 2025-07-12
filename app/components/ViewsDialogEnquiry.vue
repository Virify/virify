<template>
  <div class="enquiry-dialog">
    <h2>Send Enquiry</h2>
    <form @submit.prevent="onSend">
      <textarea v-model="message" placeholder="Type your message..." rows="5" class="enquiry-textarea" />
      <div class="dialog-actions">
        <button type="button" class="button button-ghost" @click="onClose">Cancel</button>
        <button type="submit" class="button button-primary" :disabled="!message || sending">Send</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
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
.enquiry-dialog {
  padding: 2rem;
  min-width: 320px;
}
.enquiry-textarea {
  width: 100%;
  min-height: 100px;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 1px solid var(--foreground-100);
  padding: 0.75rem;
  font-size: 1rem;
}
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
