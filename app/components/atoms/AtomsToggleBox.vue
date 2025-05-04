<template>
  <label class="a-toggle-box | font-semibold body-sm lineheight-sm">
    <input :type v-model="checked" :value="label.name" :name="name" class="| visually-hidden" />
    {{ label.name }}
  </label>
</template>

<script setup lang="ts">
import type { PropertyType } from '@prisma/client';

interface Props {
  label: PropertyType,
  name: string
  type?: 'radio' | 'checkbox'
}

withDefaults(defineProps<Props>(), {
  type: 'radio'
})

const checked = defineModel({ default: false })
</script>

<style lang="scss">
.a-toggle-box {
  display: block;
  background: var(--background-200);
  color: var(--foreground-100);
  box-shadow: inset 0 0 0 1px light-dark(var(--monochrome-700), var(--monochrome-400));
  padding: var(--size-10) var(--size-16);
  border-radius: var(--border-radius-ui);
  white-space: nowrap;
  cursor: pointer;
  transition: background-color var(--animation-fast), box-shadow var(--animation-fast), transform var(--animation-fast);

  &:active {
    transform: scale(0.96);
  }

  &:hover {
    background: light-dark(var(--background-300), var(--background-100));
  }

  &:has(:focus-visible) {
    outline: var(--focus-outline);
  }

  &:has(input:checked) {
    background: light-dark(var(--background-300), var(--background-100));
    box-shadow: inset 0 0 0 2px currentColor;

    &:hover {
      box-shadow: inset 0 0 0 2px currentColor;
    }
  }
}
</style>