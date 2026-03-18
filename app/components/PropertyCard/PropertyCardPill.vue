<template>
  <span class="property-card-pill | body-2xs" :class="{
    'property-card-pill--orange': variant === 'orange'
  }">
    {{ content }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  content: string
  variant?: 'orange' | 'default'
}

withDefaults(defineProps<Props>(), {
  variant: 'default'
})

</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

.property-card-pill {
  display: block;
  width: fit-content;
  // @TODO - maybe pill colours should be a global variable?
  border: 1px solid light-dark(var(--blue-600), var(--blue-400));
  background: light-dark(var(--blue-700), var(--blue-300));
  color: light-dark(var(--blue-100), var(--monochrome-900));
  border-radius: var(--border-radius-md);
  padding: var(--size-2) var(--size-6);
  white-space: nowrap;
  font-weight: var(--font-semisemibold);

  &--orange {
    // @TODO - maybe pill colours should be a global variable?
    color: light-dark(var(--primary-400), var(--monochrome-900));
    border-color: light-dark(var(--primary-700), #{ fn.faded-color(25%, var(--primary-500)) });
    background: light-dark(var(--primary-800), #{ fn.faded-color(15%, var(--primary-500)) });
  }
}
</style>