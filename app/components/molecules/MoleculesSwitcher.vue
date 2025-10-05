<template>
  <fieldset ref="$wrapper" class="m-switcher-text | relative" :class="{
    'm-switcher-text-loading': !isMounted
  }">
    <legend v-if="legend" class="| visually-hidden">
      {{ legend }}
    </legend>

    <span ref="$highlight" class="m-switcher-text-highlight"></span>

    <label ref="$labels" v-for="{ key, value } of options" :key class="m-switcher-text-label | font-semibold">
      <input type="radio" class="| visually-hidden" :value="key" v-model="selected" :name />
      {{ value }}
    </label>
  </fieldset>
</template>

<script setup lang="ts">
import { useResizeObserver, watchImmediate } from '@vueuse/core'

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

/**
 *  Loading state
 */
const isMounted = ref(false)

/**
 *  Update highlight position
 */
const $labels = useTemplateRef('$labels')
const $highlight = useTemplateRef('$highlight')
const $wrapper = useTemplateRef('$wrapper')

function updateHighlightPosition() {
  // Search for active label
  const activeLabel = unref($labels)?.find(label => {
    return label.querySelector('input:checked')
  })

  // If no valid matches found, do nothing
  if (!isElement(activeLabel)) return

  // Get width, left position of active element
  const { offsetLeft, offsetWidth } = activeLabel

  // Get highlight as a non-reactive value
  const highlight = unref($highlight);

  // Do nothing if highlight is not an element
  if (!isElement(highlight)) return

  // Update higlight positions accordingly
  highlight.style.width = `${offsetWidth}px`
  highlight.style.left = `${offsetLeft}px`
}

onMounted(() => {
  isMounted.value = true

  watchImmediate(selected, updateHighlightPosition)
  useResizeObserver($wrapper, updateHighlightPosition)
})
</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

:where(.m-switcher-text) {
  --switcher-outer-radius: var(--border-radius-xl);
  --switcher-inner-radius: var(--border-radius-lg);
}

.m-switcher-text {
  display: flex;
  padding: 0;
  border: 0;
  background: var(--background-300);
  color: var(--foreground-300);
  padding: var(--size-4);
  border-radius: var(--switcher-outer-radius);
  box-sizing: border-box;
}

.m-switcher-text-label {
  display: block;
  position: relative;
  z-index: 1;
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
}

.m-switcher-text-loading .m-switcher-text-label:has(input:checked) {
  background: var(--secondary-500);
  box-shadow: var(--monochrome-100);
}

.m-switcher-text-highlight {
  position: absolute;
  top: var(--size-4);
  left: var(--size-4);
  height: calc(100% - (2 * var(--size-4)));
  width: 0;
  background: var(--secondary-500);
  box-shadow: var(--monochrome-100);
  border-radius: var(--switcher-inner-radius);

  transition-property: width, left;
  transition-duration: var(--animation-medium);
  transition-timing-function: var(--ease-out);
}
</style>