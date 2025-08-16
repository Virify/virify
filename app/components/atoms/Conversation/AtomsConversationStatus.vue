<template>
  <div class="conversation-status">
    <span class="status-time | body-xs">{{ timestamp }}</span>
    <div v-if="showReadStatus" class="read-status">
      <AtomsIcon :icon="isRead ? 'account/read' : 'account/sent'" size="12" />
      <span class="status-text | body-xs">{{ isRead ? 'Read' : 'Sent' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  timestamp: string;
  showReadStatus?: boolean;
  isRead?: boolean;
}>();
</script>

<style lang="scss" scoped>
.conversation-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--size-8);
  color: var(--monochrome-300);

  .status-time {
    color: var(--monochrome-300);
    flex-shrink: 0;
  }

  .read-status {
    display: flex;
    align-items: center;
    gap: var(--size-4);
  }
}
</style>