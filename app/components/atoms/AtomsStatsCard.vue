<template>
  <div class="stats-card" :class="{ 'animate-in': animated }">
    <div class="stats-card__top">
      <div class="stats-card__content">
        <div v-if="iconName" class="stats-card__icon">
          <AtomsIcon :icon="iconName" :size="32" />
        </div>
        <div class="stats-card__text">
          <div class="stats-card__value | r-title-xl-md">{{ value }}</div>
          <div class="stats-card__subtitle | body-sm font-bold">{{ subtitle }}</div>
        </div>
      </div>
    </div>
    <div class="stats-card__title | r-body-md-sm font-bold">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  value: string
  subtitle: string
  title: string
  iconName?: string
  animated?: boolean
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.stats-card {
  border-radius: var(--border-radius-xl);
  padding: 0;
  transition: opacity 0.4s ease-out, transform 0.15s ease;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  opacity: 0;
  transform: translateY(30px);
  color: var(--foreground-200);

  &.animate-in {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover {
    transform: translateY(-4px);
  }

  // Generate staggered delays for entrance animation only (opacity only)
  @for $i from 1 through 15 {
    &:nth-child(#{$i}) {
      transition: opacity 0.4s ease-out #{$i * 0.1}s,
      transform 0.15s ease;
    }
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
    padding: var(--size-16);
    background-size: cover;
    min-height: 100px;
  }

  &__content {
    display: flex;
    align-items: center;
    gap: var(--size-12);
    width: 100%;
  }

  &__icon {
    display: flex;
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: var(--border-radius-lg);
    padding: var(--size-12);
    align-items: center;
    justify-content: center;

    .a-icon {
      color: var(--monochrome-900);
    }
  }

  &__text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--size-4);
  }

  &__value {
    color: inherit;
    line-height: 1;
    margin-bottom: var(--size-4);
    color: var(--monochrome-300);
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

// Mobile layout 
@media (max-width: 900px) {
  .stats-card {
    &__top {
      min-height: 80px;
    }

    &__title {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--size-16);
    }
  }
}
</style>