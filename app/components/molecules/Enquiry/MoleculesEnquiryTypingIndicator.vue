<template>
  <div v-if="isVisible" class="m-typing-indicator | body-sm">
    <div class="m-typing-dots">
      <span class="m-typing-dot"></span>
      <span class="m-typing-dot"></span>
      <span class="m-typing-dot"></span>
    </div>
    <span class="m-typing-text">typing...</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isVisible: boolean;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
.m-typing-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: var(--foreground-500);
  opacity: 0.8;
}

.m-typing-dots {
  display: flex;
  gap: 2px;
}

.m-typing-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--foreground-500);
  animation: typing-pulse 1.4s infinite ease-in-out;
}

.m-typing-dot:nth-child(1) {
  animation-delay: -0.32s;
}

.m-typing-dot:nth-child(2) {
  animation-delay: -0.16s;
}

.m-typing-dot:nth-child(3) {
  animation-delay: 0s;
}

@keyframes typing-pulse {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.m-typing-text {
  font-style: italic;
  margin-left: 0.25rem;
}
</style>
