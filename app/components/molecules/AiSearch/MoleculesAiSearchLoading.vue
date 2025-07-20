<template>
  <div class="loading-content">
    <div class="loading-details">
      <span class="loading-query | body-sm">"{{ lastSearchQuery }}"</span>
    </div>
    <img src="/img/ai-loading.svg" class="loading-spinner" />
    <p class="loading-text body-sm">{{ loadingMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { loadingMessages } from '~/utils/search-form/loading-messages';
defineProps<{
  lastSearchQuery: string;
}>();


const loadingMessage = computed(() => {
  const randomIndex = Math.floor(Math.random() * loadingMessages.length);
  return loadingMessages[randomIndex] ?? 'Searching for properties...';
});
</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

.loading-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--size-32);
}

.loading-spinner {
  display: flex;
  justify-content: center;
  color: var(--secondary-400);
  width: auto;
  height: 4ch;
}

.loading-text {
  color: var(--text-color);
  font-size: var(--font-size-md);
  min-height: var(--size-32);
}

.loading-details {
  margin: 0;
}

.loading-query {
  display: inline-block;
  padding: var(--size-8) var(--size-16);
  border: 1px solid fn.faded-color(15%);
  border-radius: var(--border-radius-lg);
  font-weight: var(--font-weight-medium);
  font-style: italic;
}
</style>
