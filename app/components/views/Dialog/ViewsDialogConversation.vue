<template>
  <div class="| flow dialog-container dialog-container-sm">
    <h1 class="| title-xl">Start Enquiry</h1>
    <p class="| body-sm">Write your message or question below - we will notify them of your message.</p>
    <AtomsDivider text="Hint" />
    <p class="| body-sm">You can view your enquiries in the dashboard or check your notifications for a reply.</p>
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
const { startConversation, hasContactedListing } = useEnquiries();
const { hideDialog } = useDialog();
const toast = useToast();

async function onSend() {
  if (!message.value.trim()) return;
  
  // Check if conversation already exists before sending
  if (hasContactedListing(props.listingId)) {
    toast.add({ title: 'Already Contacted', description: 'You have already started a conversation for this listing.', icon: 'i-lucide-circle-x', color: 'error' });
    hideDialog();
    return;
  }

  sending.value = true;
  try {
    await startConversation(props.listingId, props.receiverId, message.value.trim());
    toast.add({ title: 'Success', description: 'Message sent successfully!', icon: 'i-lucide-message-circle', color: 'success' });
    hideDialog();
  } catch (e) {
    toast.add({ title: 'Error', description: 'Failed to send message. Please try again.', icon: 'i-lucide-circle-x', color: 'error' });
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
