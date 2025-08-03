<template>
  <div class="stats-card">
    <div class="stats-card__top">
      <div class="stats-card__value | r-title-xl-md">{{ value }}</div>
      <div class="stats-card__subtitle | body-sm font-bold">{{ subtitle }}</div>
    </div>
    <div class="stats-card__title | r-body-md-sm font-bold">{{ title }}</div>
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
  transition: all 0.6s ease-out;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  opacity: 0;
  transform: translateY(30px);

  &.animate-in {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover {
    transform: translateY(-2px);
  }

  &:nth-child(1) { transition-delay: 0.1s; }
  &:nth-child(2) { transition-delay: 0.2s; }
  &:nth-child(3) { transition-delay: 0.3s; }
  &:nth-child(4) { transition-delay: 0.4s; }
  &:nth-child(5) { transition-delay: 0.5s; }
  &:nth-child(6) { transition-delay: 0.6s; }
  &:nth-child(7) { transition-delay: 0.7s; }
  &:nth-child(8) { transition-delay: 0.8s; }

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
    padding: var(--size-16);
    background-size: cover;
    min-height: 100px;

  }

  &__value {
    color: var(--monochrome-300);
    line-height: 1;
    margin-bottom: var(--size-4);
  }

  &__subtitle {
    color: var(--monochrome-300);
  }

  &__title {
    background: var(--background-200);
    padding: var(--size-16);
    color: var(--foreground-100);
    text-align: center;
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

// Mobile layout for equal heights
@media (max-width: 900px) {
  .stats-card {

    &__top {
      flex: 1;
      min-height: 80px;
    }

    &__title {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--size-16);
    }
  }
}
</style>