<template>
  <div class="conversation-bubble" :class="{ 'sent': variant === 'sent', 'received': variant === 'received' }">
    <p class="bubble-content | body-sm">{{ content }}</p>
    <slot name="status" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  content: string;
  variant: 'sent' | 'received';
}>();
</script>

<style lang="scss" scoped>
.conversation-bubble {
  background: var(--primary-600);
  padding: var(--size-12) var(--size-16);
  border-radius: var(--border-radius-lg);
  border-bottom-left-radius: 0;
  max-width: 280px;
  align-self: flex-start;
  position: relative;

  &.sent {
    background: var(--secondary-500);
    color: var(--foreground-100);
    margin-left: auto;
    border-bottom-left-radius: var(--border-radius-lg);
    border-bottom-right-radius: 0;
  }

  .bubble-content {
    margin: 0 0 var(--size-8) 0;
    color: var(--monochrome-100);
  }
}
</style>