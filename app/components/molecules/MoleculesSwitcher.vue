<template>
  <fieldset class="m-toggle-text">
    <legend v-if="legend" class="| visually-hidden">
      {{ legend }}
    </legend>

    <label v-for="{ key, value } of options" :key class="m-toggle-text-label | font-semibold">
      <input type="radio" class="| visually-hidden" :value="key" v-model="selected" />
      {{ value }}
    </label>
  </fieldset>
</template>

<script setup lang="ts">
interface Props {
  legend?: string,
  options: { key: string, value: string }[]
}

defineProps<Props>()

const selected = defineModel({ default: 'buy' })
</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

.m-toggle-text {
  display: flex;
  margin: 0;
  padding: 0;
  border: 0;
  background: var(--background-300);
  color: var(--foreground-300);
  padding: var(--size-4);
  border-radius: var(--size-12);
  width: 100%;
  box-sizing: border-box;
}

.m-toggle-text-label {
  display: block;
  padding: var(--size-4) var(--size-16);
  border-radius: var(--size-8);
  flex-grow: 1;
  text-align: center;
  font-size: var(--font-sm);
  cursor: pointer;

  &:focus,
  &:focus-within {
    outline: var(--focus-outline);
  }

  &:has(input:checked) {
    background: var(--secondary-500);
    box-shadow: var(--monochrome-100);
  }
}
</style>