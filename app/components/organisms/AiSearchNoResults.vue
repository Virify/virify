<template>
  <div class="no-results-content | flow flow-lg">
    <div class="loading-details">
      <span class="loading-query | body-sm">"{{ lastSearchQuery }}"</span>
    </div>
    <div class="flow flow-sm">
      <h2 class="title-md">No Results Found</h2>
      <p class="body-sm">We couldn't find any properties matching your search.</p>
    </div>
    <div class="flow flow-md">
      <h3 class="title-sm">To improve your results, try:</h3>
      <ul class="suggestions-list">
        <li v-for="tip of suggestionTips" :key="tip" class="body-sm">
          {{ tip }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  lastSearchQuery: string;
}>();

const suggestionTips = [
  'Removing some specific requirements',
  'Searching for a different property type',
  'Expanding your location search area',
  'Using more general terms'
];
</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

.no-results-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--size-32);

  .title-md {
    color: var(--heading-color);
  }

  .title-sm {
    color: var(--heading-color);
    font-weight: var(--font-weight-semibold);
  }
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

.suggestions-list {
  list-style: disc;
  padding-left: var(--size-24);
  text-align: left;
  max-width: 40ch;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--size-8);
}
</style>
