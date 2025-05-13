<template>
  <fieldset class="m-toggle-text">
    <legend v-if="legend" class="| visually-hidden">
      {{ legend }}
    </legend>

    <label v-for="{ key, value } of options" :key class="m-toggle-text-label | font-semibold">
      <input type="radio" class="| visually-hidden" :value="key" v-model="selected" :name />
      {{ value }}
    </label>
  </fieldset>
</template>

<script setup lang="ts">
interface Props {
  legend?: string
  name?: string
  options: { key: string, value: string }[]
}

defineProps<Props>()

/**
 *  Track current value
 */
const selected = defineModel({ default: 'buy' })

</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

:where(.m-toggle-text) {
  --switcher-outer-radius: var(--border-radius-xl);
  --switcher-inner-radius: var(--border-radius-lg);
}

.m-toggle-text {
  display: flex;
  padding: 0;
  border: 0;
  background: var(--background-300);
  color: var(--foreground-300);
  padding: var(--size-4);
  border-radius: var(--switcher-outer-radius);
  box-sizing: border-box;
}

.m-toggle-text-label {
  display: block;
  padding: var(--size-6) var(--size-24);
  line-height: var(--lineheight-sm);
  border-radius: var(--switcher-inner-radius);
  flex: 1 0 0px;
  text-align: center;
  font-size: var(--font-sm);
  cursor: pointer;

  &:has(:focus-visible) {
    outline: var(--focus-outline);
  }

  &:has(input:checked) {
    background: var(--secondary-500);
    box-shadow: var(--monochrome-100);
  }
}
</style>