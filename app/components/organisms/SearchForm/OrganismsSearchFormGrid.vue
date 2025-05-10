<template>
  <div class="o-searchform-grid" :class="{
    'o-searchform-grid-auto': gridAuto
  }" role="presentation">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  gridAuto: boolean
}

withDefaults(defineProps<Props>(), {
  gridAuto: false
})
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.o-searchform-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--flow-gap);

  @include mq.tablet {
    grid-template-columns: repeat(2, 1fr);

    &-auto {
      grid-template-columns: repeat(2, auto);
    }
  }
}
</style>