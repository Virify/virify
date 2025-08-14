
<template>
  <div
    :class="['a-hero-card', variantClass]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'primary' | 'secondary';
}

const props = defineProps<Props>();

const variantClass = props.variant === 'primary'
  ? 'a-hero-card--primary'
  : props.variant === 'secondary'
    ? 'a-hero-card--secondary'
    : '';
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;
.a-hero-card {
  border-radius: var(--border-radius-2xl);
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  padding: var(--size-32);
  gap: var(--size-8);
  background: url('/img/logo-background.svg') no-repeat bottom right, var(--blue-400);
  background-size: auto 150%, cover;
  color: var(--monochrome-900);

  .button {
    margin: var(--size-16) 0;
    color: var(--foreground-100);
  }
}

.a-hero-card--primary {
  background: url('/img/logo-background.svg') no-repeat bottom right, linear-gradient(135deg, var(--monochrome-100), var(--primary-400));
  background-size: auto 150%, cover;

  .button {
    color: var(--monochrome-100)
  }
}

.a-hero-card--secondary {
  background: url('/img/logo-background.svg') no-repeat bottom right, linear-gradient(135deg, var(--monochrome-100), var(--secondary-400));
  background-size: auto 150%, cover;

  .button {
    color: var(--monochrome-100)
  }
}
</style>