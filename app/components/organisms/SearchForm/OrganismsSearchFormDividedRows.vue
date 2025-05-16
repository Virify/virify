<template>
  <div class="o-searchform-divided-rows" :class="{
    'o-searchform-divided-rows-no-divider': hideDivider
  }" role="presentation">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  hideDivider?: boolean
}

withDefaults(defineProps<Props>(), {
  hideDivider: false
})
</script>

<style lang="scss">
.o-searchform-divided-rows {
  padding: var(--popover-padding) 0;
  border-bottom: 1px solid var(--border-color-200);

  &-no-divider {
    border-bottom: none;
  }

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }
}
</style>