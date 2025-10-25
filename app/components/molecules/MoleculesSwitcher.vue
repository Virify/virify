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

/**
 *  @TODO
 *  Convert to composable so reuse with
 *  app/components/organisms/Dock/Inputs/OrganismsDockInputsLayout.vue
 */
function updateHighlightPosition(isResize = false) {
  // Search for active label
  const activeLabel = unref($labels)?.find(label => {
    return label.querySelector('input:checked')
  })

  // Get highlight as a non-reactive value
  const highlight = unref($highlight);

  // Do nothing if highlight is not an element
  if (!isElement(highlight) || !isElement(activeLabel)) return

  // Get width, left position of active element
  const { offsetLeft, offsetWidth } = activeLabel

  // Get current, previous states
  const previousLeft = highlight.style.left
  const previousWidth = highlight.style.width
  const nextLeft = offsetLeft + 'px'
  const nextWidth = offsetWidth + 'px'

  // Do not animate resizes
  if (isResize || !previousWidth) {
    highlight.style.left = nextLeft
    highlight.style.width = nextWidth

    return
  }

  // Clear any existing animatinos
  highlight.getAnimations().forEach(animation => {
    if ((animation instanceof CSSTransition)) return

    // Hide abort errors - they are intended
    animation.finished.catch(() => { })

    // Cancel existing animations
    animation.cancel()

    // Set to intended state
    highlight.style.left = nextLeft
    highlight.style.width = nextWidth
  })

  // Do a little bounce animation whilst animating
  const animation = highlight.animate([
    {
      transform: '',
      width: previousWidth,
      left: previousLeft,
    },
    { transform: 'scale(1.8, 1)' },
    {
      transform: '',
      width: nextWidth,
      left: nextLeft,
    },
  ], {
    duration: 250,
    easing: 'cubic-bezier(0.3, 0.5, 0.5, 1)',
  })

  // Apply final style to slider
  animation.finished.then(() => {
    highlight.style.left = nextLeft
    highlight.style.width = nextWidth
  }).catch(() => { })
}

onMounted(() => {
  isMounted.value = true

  watchImmediate(selected, () => updateHighlightPosition(false))
  useResizeObserver($wrapper, () => updateHighlightPosition(true))
})
</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

:where(.m-switcher-text) {
  --switcher-outer-radius: var(--border-radius-xl);
  --switcher-inner-radius: var(--border-radius-lg);
  --switcher-highlight-offset: var(--size-4);
  --switcher-outer-padding: var(--size-4);
  --switcher-inner-padding: var(--size-6) var(--size-24);
}

.m-switcher-text {
  display: flex;
  border: 0;
  padding: var(--switcher-outer-padding);
  background: transparent;
  border: 1px solid var(--border-color-200);
  color: var(--foreground-300);
  border-radius: var(--switcher-outer-radius);
  box-sizing: border-box;
}

.m-switcher-text-label {
  display: block;
  position: relative;
  z-index: 1;
  padding: var(--switcher-inner-padding);
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
  top: var(--switcher-highlight-offset);
  left: var(--switcher-highlight-offset);
  height: calc(100% - (2 * var(--switcher-highlight-offset)));
  width: 0;
  background: var(--secondary-500);
  box-shadow: var(--monochrome-100);
  border-radius: var(--switcher-inner-radius);
  transform-origin: 50% 50%;
}
</style>