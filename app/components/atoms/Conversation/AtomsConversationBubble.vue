<template>
  <div class="conversation-bubble" :class="{ 'sent': variant === 'sent', 'received': variant === 'received' }">
    <p class="bubble-user | body-xs">{{ contentPov }}</p>
    <p class="bubble-content | body-sm">{{ content }}</p>
    <slot name="status" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  user: String;
  content: string;
  variant: 'sent' | 'received';
}>();

const contentPov = computed(() => {
return props.variant === 'sent' ? 'You' : props.user;
});
</script>

<style lang="scss" scoped>
.conversation-bubble {
  background: var(--secondary-500);
  color: var(--monochrome-100);
  padding: var(--size-12) var(--size-16);
  border-radius: var(--border-radius-lg);
  border-bottom-left-radius: 0;
  max-width: 280px;
  min-width: 50%;
  align-self: flex-start;
  position: relative;

  &.sent {
    background: var(--background-100);
    color: var(--foreground-300);
    margin-left: auto;
    border-bottom-left-radius: var(--border-radius-lg);
    border-bottom-right-radius: 0;
  }

  .bubble-user {
    font-style: italic;
  }

  .bubble-content {
    margin: 0 0 var(--size-8) 0;
  }
}
</style>