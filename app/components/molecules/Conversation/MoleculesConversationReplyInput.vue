<template>
  <div class="reply-section">
    <div class="reply-input-container">
      <input v-model="message" type="text" class="reply-input | body-sm" placeholder="Message..."
        @keydown.enter.prevent="handleSend" />
      <button class="send-btn" :disabled="!message.trim() || sending" @click="handleSend">
        <AtomsIcon v-if="!sending" icon="ai/send" size="20" />
        <span v-else class="loading-text">...</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const message = ref('');
const sending = ref(false);

const emit = defineEmits<{
  (e: 'send', message: string): void;
}>();

async function handleSend() {
  if (!message.value.trim()) return;
  sending.value = true;
  emit('send', message.value);
  message.value = '';
  sending.value = false;
}
</script>

<style lang="scss" scoped>
.reply-section {
  flex-shrink: 0;
  background: var(--background-200);
  border-top: 1px solid var(--border-100);
  
  @media (max-width: 768px) {
    padding-bottom: calc(var(--size-16) + 90px + env(safe-area-inset-bottom));
  }

  .reply-input-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .reply-input {
    width: 100%;
    padding: var(--size-8);
    border-radius: var(--border-radius-2xl);
    border: 1px solid var(--monochrome-600);
    background: var(--background-100);
    color: var(--foreground-100);
    outline: none;

    &:focus {
      border-color: var(--secondary-400);
    }
  }

  .send-btn {
    position: absolute;
    right: var(--size-4);
    top: 50%;
    transform: translateY(-50%);
    background: var(--secondary-400);
    color: var(--foreground-100);
    border: none;
    padding: var(--size-8);
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--size-36);
    height: var(--size-36);

    &:hover:not(:disabled) {
      background: var(--secondary-500);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .loading-text {
      font-size: 12px;
      font-weight: bold;
    }
  }
}
</style>
