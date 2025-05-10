<template>
  <fieldset class="m-toggle-text">
    <legend v-if="legend" class="| visually-hidden">
      {{ legend }}
    </legend>

    <label v-for="{ key, value, tabindex } of optionsWithTabIndex" :key class="m-toggle-text-label | font-semibold">
      <input type="radio" class="| visually-hidden" :value="key" v-model="selected" :tabindex :name />
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

const props = defineProps<Props>()

/**
 *  Track current value
 */
const selected = defineModel({ default: 'buy' })

/**
 *  Toggle tabindex only for active toggle
 */
const optionsWithTabIndex = computed(() => {
  const { options } = props

  // If not a valid array, return nothing
  if (!isArrayOfOptions(options)) return []

  // Set only the current option to have a focusable tabindex
  return options.map(option => ({
    ...option,
    tabindex: option.key === selected.value ? 0 : -1
  }))
})
</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

.m-toggle-text {
  display: flex;
  padding: 0;
  border: 0;
  background: var(--background-300);
  color: var(--foreground-300);
  padding: var(--size-4);
  border-radius: var(--size-12);
  box-sizing: border-box;
}

.m-toggle-text-label {
  display: block;
  padding: var(--size-4) var(--size-24);
  border-radius: var(--size-8);
  flex: 1 0 0px;
  text-align: center;
  font-size: var(--font-sm);
  cursor: pointer;

  &:has(:focus-visible) {
    outline: var(--focus-outline);
  }

  &:has(input:checked) {
    background: var(--secondary-400);
    box-shadow: var(--monochrome-100);
  }
}
</style>