<template>
  <div class="stats-card">
    <div class="stats-card__top">
      <div class="stats-card__value">{{ value }}</div>
      <div class="stats-card__subtitle">{{ subtitle }}</div>
    </div>
    <div class="stats-card__title">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  value: string
  subtitle: string
  title: string
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.stats-card {
  border-radius: var(--border-radius-xl);
  padding: 0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);


  &:hover {
    transform: translateY(-2px);
  }

  &__top {
    background: 
      linear-gradient(135deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.02)),
      url('/img/call-out-bg.svg'),
      var(--secondary-400);
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    padding: var(--size-64) var(--size-24) var(--size-24) var(--size-24);
    background-size: cover;
  }

  &__value {
    font-size: 3rem;
    font-weight: 900;
    color: var(--monochrome-300);
    line-height: 1;
    margin-bottom: var(--size-4);
  }

  &__subtitle {
    font-size: var(--font-size-lg);
    color: var(--monochrome-300);
    font-weight: var(--font-semibold);
  }


  &__title {
    background: var(--background-200);
    padding: var(--size-32);
    color: var(--foreground-100);
    font-size: var(--font-lg);
    font-weight: var(--font-bold);
    text-align: center;
  }
}
</style>