<template>
  <div class="m-ai-search-loading">
    <img src="/img/ai-loading.svg" class="m-ai-search-loading__spinner" />
    <p class="m-ai-search-loading__content | body-lg">
      {{ loadingMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { loadingMessages } from '~/utils/search-form/loading-messages';

const loadingMessage = computed(() => {
  const randomIndex = Math.floor(Math.random() * loadingMessages.length);

  return loadingMessages[randomIndex] ?? 'Searching for properties...';
});
</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

.m-ai-search-loading {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--size-24);
  padding: 0 var(--size-16) var(--size-24);
  box-sizing: border-box;

  &__spinner {
    display: flex;
    justify-content: center;
    color: var(--primary-400);
    width: auto;
    height: 4ch;
  }

  &__content {
    color: var(--text-color);
    text-align: center;
    line-height: var(--lineheight-md);
  }
}
</style>
