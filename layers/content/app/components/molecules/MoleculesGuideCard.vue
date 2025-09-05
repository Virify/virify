<template>
  <NuxtLink :to="to" class="guide-card">
    <div class="guide-card__icon">
      <AtomsIcon :icon="icon" :size="48" />
    </div>
    <h3 class="guide-card__title | title-lg">{{ title }}</h3>
    <p class="guide-card__description | title-sm">{{ description }}</p>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  to: string
  icon: string
  description?: string
}>()
</script>

<style scoped lang="scss">
.guide-card {
  display: block;
  background: var(--secondary-800);
  border-radius: var(--border-radius-lg);
  text-decoration: none;
  transition: all 0.3s ease;
  text-align: center;
  padding: var(--size-32);

  &:hover {
    transform: translateY(-4px);
  }

  &__icon {
    display: flex;
    justify-content: center;
    padding-bottom: var(--size-16);

    svg {
      color: var(--secondary-400);
    }
  }

  &__title {
    color: var(--secondary-400);
  }

  &__description {
    margin-top: var(--size-8);
  }
}
</style>