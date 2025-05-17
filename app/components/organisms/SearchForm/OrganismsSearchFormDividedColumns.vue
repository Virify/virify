<template>
  <div role="presentation" class="o-searchform-divided-columns">
    <slot name="left-column"></slot>
    <div class="o-searchform-divided-columns-divider"></div>
    <slot name="right-column"></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  gridAuto?: boolean
  hasDivider?: boolean
}

withDefaults(defineProps<Props>(), {
  gridAuto: false,
  hasDivider: false
})
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.o-searchform-divided-columns {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--popover-padding);
  align-items: stretch;

  &-divider {
    border-bottom: 1px solid var(--border-color-300);
  }

  @include mq.tablet {
    grid-template-columns: 1fr auto 1fr;

    &-divider {
      border-bottom: 0;
      border-left: 1px solid var(--border-color-200);
    }
  }
}
</style>