<template>
  <div class="a-aria-tooltip">
    <div 
      class="a-aria-tooltip__trigger"
      :aria-describedby="tooltipId"
    >
      <slot />
    </div>
    <div 
      :id="tooltipId"
      class="a-aria-tooltip__content | body-xs"
      role="tooltip"
    >
      {{ content }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  content: string;
}

defineProps<Props>();

const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;
</script>

<style lang="scss" scoped>
.a-aria-tooltip {
  position: relative;
  display: inline-block;

  &:hover &__content {
    opacity: 1;
    visibility: visible;
  }

  &__trigger {
    display: block;
    width: 100%;
  }

  &__content {
    position: absolute;
    bottom: calc(100% + var(--size-8));
    left: 50%;
    transform: translateX(-50%);
    background: var(--background-100);
    color: var(--foreground-100);
    padding: var(--size-8) var(--size-12);
    border-radius: var(--border-radius-lg);
    white-space: nowrap;
    text-transform: none;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease-in-out;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    pointer-events: none;

    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 5px solid transparent;
      border-top-color: var(--background-100);
    }
  }
}
</style>


