<template>
  <div class="no-results">
    <div class="no-results__card">
      <div class="no-results__icon">
        <AtomsIcon icon="search" />
      </div>
      
      <div class="no-results__content | flow flow-sm">
        <h2 class="no-results__title | title-md">No properties found</h2>
        <p class="no-results__query | body-sm">"{{ lastSearchQuery }}"</p>
      </div>

      <div class="no-results__tips">
        <p class="no-results__tips-title | body-sm">Try adjusting your search:</p>
        <ul class="no-results__tips-list">
          <li v-for="tip of suggestionTips" :key="tip">
            <AtomsIcon icon="tick" class="no-results__tip-icon" />
            <span>{{ tip }}</span>
          </li>
        </ul>
      </div>

      <NuxtLink to="/" class="no-results__cta | button button-sm button-primary">
        Start a new search
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  lastSearchQuery: string;
}>();

const suggestionTips = [
  'Broaden your location radius',
  'Use simpler search terms',
  'Try a different property type',
  'Remove specific requirements'
];
</script>

<style lang="scss">
.no-results {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: var(--size-32) var(--size-16);
  min-height: 60vh;

  &__card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--size-24);
    padding: var(--size-32) var(--size-24);
    max-width: 400px;
    width: 100%;
    background: var(--surface-elevated);
    border-radius: var(--border-radius-2xl);
    border: 1px solid var(--border-color);
    text-align: center;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
    color: white;

    .a-icon {
      width: 28px;
      height: 28px;
    }
  }

  &__content {
    text-align: center;
  }

  &__title {
    color: var(--heading-color);
  }

  &__query {
    display: inline-block;
    padding: var(--size-6) var(--size-12);
    background: var(--surface-muted);
    border-radius: var(--border-radius-lg);
    color: var(--text-muted);
    font-style: italic;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__tips {
    width: 100%;
    padding: var(--size-16);
    background: var(--surface-muted);
    border-radius: var(--border-radius-xl);
  }

  &__tips-title {
    color: var(--text-muted);
    margin-bottom: var(--size-12);
    font-weight: var(--font-weight-medium);
  }

  &__tips-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--size-8);
    text-align: left;

    li {
      display: flex;
      align-items: center;
      gap: var(--size-8);
      font-size: var(--font-size-sm);
      color: var(--text-color);
    }
  }

  &__tip-icon {
    width: 16px;
    height: 16px;
    color: var(--brand-primary);
    flex-shrink: 0;
  }

  &__cta {
    margin-top: var(--size-8);
  }
}
</style>
