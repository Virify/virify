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
.property-card-pill {
  display: block;
  width: fit-content;
  border: 1px solid var(--monochrome-600);
  background: var(--monochrome-800);
  color: var(--monochrome-100);
  border-radius: var(--border-radius-md);
  padding: var(--size-2) var(--size-6);
  white-space: nowrap;
  font-weight: var(--font-semisemibold);

  &--orange {
    color: light-dark(var(--secondary-400), var(--monochrome-900));
    border-color: light-dark(var(--secondary-700), var(--secondary-600));
    background: light-dark(var(--secondary-800), var(--secondary-400));
  }
}
</style>