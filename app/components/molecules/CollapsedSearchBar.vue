<template>
  <div class="collapsed-search-bar">
    <div class="query-info">
      <p class="query-text body-md font-semibold">
        <template v-for="(segment, index) in segments" :key="index">
          <span :class="`segment--${segment.type}`">{{ segment.text }}</span>
        </template>
      </p>
    </div>
    <button @click="$emit('edit')" class="expand-button | button button-secondary button-md">
      <AtomsIcon name="arrow-down" icon="expand" />
    </button>
  </div>
</template>

<script setup lang="ts">
const { getAnalyzedQuery } = useAi();
const segments = computed(() => getAnalyzedQuery());

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

  .segment--used {
    color: var(--secondary-400);
  }

  .segment--ignored {
    text-decoration: line-through;
    opacity: 0.5;
  }
}

.expand-button {
  color: var(--monochrome-900);
}
</style>
