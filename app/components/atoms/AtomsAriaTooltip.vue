<template>
  <div class="a-aria-tooltip">
    <div class="a-aria-tooltip__trigger" :aria-describedby="tooltipId">
      <slot />
    </div>
    <div :id="tooltipId" class="a-aria-tooltip__content | body-xs" role="tooltip">
      {{ content }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  content: string;
  id?: string;
}

const props = defineProps<Props>();

const tooltipId = computed(() => {
  if (props.id) {
    return `tooltip-${props.id}`;
  }
  // Fallback to a hash of the content for SSR consistency
  return `tooltip-${btoa(props.content).replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`;
});
</script>

<style lang="scss" scoped>
.a-aria-tooltip {
  position: relative;

  &:hover &__content {
    opacity: 1;
    visibility: visible;
    overflow: visible;
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
    background: var(--background-200);
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
      border-top-color: var(--background-200);
    }
  }
}
</style>
