<template>
  <div
    class="toast"
    :class="[
      `toast-${type}`,
      { 'toast-visible': visible }
    ]"
  >
    <div class="toast-content">
      <div class="toast-icon" v-if="showIcon">
        <svg v-if="type === 'success'" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M13.485 2.929a1 1 0 0 1 0 1.414l-7 7a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414L6 9.443l6.071-6.07a1 1 0 0 1 1.414 0z"/>
        </svg>
        <svg v-else-if="type === 'error'" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
        <svg v-else-if="type === 'info'" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm1 12H7V7h2v5zM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
        </svg>
      </div>
      <div class="toast-message">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string
  type?: 'success' | 'error' | 'info'
  showIcon?: boolean
  visible?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'success',
  showIcon: true,
  visible: true
})
</script>

<style lang="scss" scoped>
.toast {
  position: fixed;
  bottom: var(--size-20);
  right: var(--size-20);
  min-width: 300px;
  max-width: 500px;
  padding: var(--size-16);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateX(calc(100% + var(--size-20)));
  transition: transform var(--animation-normal) ease-out;
  z-index: 9999;
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
}

.toast-visible {
  transform: translateX(0);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: var(--size-12);
}

.toast-icon {
  flex-shrink: 0;
  width: var(--size-16);
  height: var(--size-16);
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-message {
  flex: 1;
  line-height: var(--lineheight-sm);
}

/* Toast variants using brand colors */
.toast-success {
  background: var(--primary-400);
  color: var(--monochrome-100);
  border: 1px solid var(--primary-400);
}

.toast-error {
  background: var(--error-background, #dc2626);
  color: var(--error-foreground, white);
  border: 1px solid var(--error-foreground, #b91c1c);
}

.toast-info {
  background: var(--secondary-400);
  color: var(--monochrome-100);
  border: 1px solid var(--secondary-300);
}

/* Responsive */
@media (max-width: 640px) {
  .toast {
    right: var(--size-12);
    left: var(--size-12);
    min-width: auto;
    max-width: none;
    transform: translateY(-100vh);
  }
  
  .toast-visible {
    transform: translateY(0);
  }
}
</style>