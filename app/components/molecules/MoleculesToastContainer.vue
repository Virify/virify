<template>
  <div class="| toast-container">
    <AtomsToast
      v-for="toast in toasts"
      :key="toast.id"
      :message="toast.message"
      :type="toast.type"
      :visible="toast.visible"
      @click="hideToast(toast.id)"
    />
  </div>
</template>

<script setup lang="ts">
const { toasts, hideToast } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 9999;
  pointer-events: none;
}

.toast-container :deep(.toast) {
  pointer-events: auto;
  cursor: pointer;
  margin-bottom: var(--size-8);
}

.toast-container :deep(.toast:hover) {
  opacity: 0.9;
}
</style>