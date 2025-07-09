<template>
  <div class="collapsed-search-bar">
    <div class="query-info">
      <span class="query-text body-sm">"{{ query }}"</span>
    </div>
    <button @click="$emit('edit')" class="expand-button | button button-secondary button-md">
      <AtomsIcon name="arrow-down" icon="expand" />
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  query: string;
}>();

defineEmits(['edit']);
</script>

<style lang="scss" scoped>
.collapsed-search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--size-16) var(--size-24);
  background: var(--background-200);
  border-radius: var(--border-radius-3xl);
}

.query-info {
  display: flex;
  flex-direction: column;
  gap: var(--size-8);
  justify-content: space-between;
  overflow: hidden;
  min-width: 0;
}

.query-text {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: block;
}

.expand-button {
  color: var(--monochrome-900);
}
</style>
