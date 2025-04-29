<template>
  <label class="a-toggle-box | font-semibold body-sm lineheight-sm">
    <input :type v-model="checked" :value="label" :name="name" class="| visually-hidden" />
    {{ label }}
  </label>
</template>

<script setup lang="ts">
interface Props {
  label: string
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
  background: var(--monochrome-900);
  color: var(--monochrome-100);
  box-shadow: inset 0 0 0 1px var(--monochrome-700);
  padding: var(--size-10) var(--size-16);
  border-radius: var(--border-radius-ui);
  white-space: nowrap;
  cursor: pointer;
  transition: background-color var(--animation-fast), box-shadow var(--animation-fast);

  &:hover {
    background: var(--monochrome-800);
  }

  &:has(input:checked) {
    background: var(--monochrome-800);
    box-shadow: inset 0 0 0 2px currentColor;

    &:hover {
      box-shadow: inset 0 0 0 2px currentColor;
    }
  }
}
</style>