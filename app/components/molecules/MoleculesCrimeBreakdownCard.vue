<template>
  <div class="crime-breakdown-card">
    <div class="crime-breakdown-card__header">
      <h3 class="crime-breakdown-card__category-name | title-xs">
        {{ formatCategoryName(category) }}
      </h3>
      <p class="crime-breakdown-card__category-count | body-sm">
        {{ count }} incident{{ count !== 1 ? 's' : '' }}
      </p>
    </div>
    <div class="crime-breakdown-card__bar">
      <div class="crime-breakdown-card__fill"
        :style="{ width: `${percentage}%` }">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  category: string
  count: number
  percentage: number
}

defineProps<Props>()

function formatCategoryName(category: string): string {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>

<style lang="scss" scoped>
.crime-breakdown-card {
  background: var(--background-100);
  border: 1px solid var(--monochrome-600);
  border-radius: var(--border-radius-lg);
  padding: var(--size-16);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--size-16);

    h3 {
      margin: 0;
    }
  }


  &__bar {
    height: 4px;
    background: var(--background-300);
    border-radius: 2px;
    overflow: hidden;
  }

  &__fill {
    height: 100%;
    background: var(--secondary-400);
    transition: width 0.3s ease;
    border-radius: 2px;
  }
}
</style>