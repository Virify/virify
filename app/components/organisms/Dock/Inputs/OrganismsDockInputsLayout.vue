<template>
  <div ref="$wrapper" class="o-dock-inputs-layout" :class="{
    'o-dock-inputs-layout--loading': !isMounted
  }">
    <span ref="$highlight" class="o-dock-inputs-layout__highlight"></span>

    <label ref="$labels" v-for="{ key, value, icon } of options" :key
      class="o-dock-inputs-layout__label | font-semibold">
      <input type="radio" class="| visually-hidden" :value="key" v-model="searchState.viewMode" name="results-layout"
        :aria-label="value" />

      <AtomsIcon :icon />

      <span class="o-dock-inputs-layout__label-text">
        {{ value }}
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver, watchImmediate } from '@vueuse/core'
import type { ResultLayout } from '#imports'

/**
 *  Options
 */
type ResultLayouts = {
  key: ResultLayout,
  value: string
  icon: string
}[]

const isDesktop = useDesktop()

const options = computed(() => {
  const allOptions: ResultLayouts = [
    { key: 'grid', value: 'Grid', icon: 'search/grid' },
    { key: 'split', value: 'Split', icon: 'search/split' },
    { key: 'map', value: 'Map', icon: 'search/map' },
  ]

  if (isDesktop.value) return allOptions

  return allOptions.filter(({ key }) => key !== 'split')
})

/**
 *  Layout state
 */
const { searchState, setViewMode } = useSearchState()
const { viewMode } = toRefs(searchState.value)

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

async function updateHighlightPosition() {
  await nextTick()

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

  watchImmediate(viewMode, updateHighlightPosition)
  useResizeObserver($wrapper, updateHighlightPosition)
})

/**
 *  Update layout in state
 */
watch(options, (newValue) => {
  if (newValue.length !== 2 || viewMode.value !== 'split') {
    return
  }

  setViewMode('grid')
})

</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.o-dock-inputs-layout {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  border: 0;
  margin: 0;
  padding: 0;
  background: var(--background-300);
  color: var(--foreground-300);
  border-radius: var(--border-radius-2xl);
  box-sizing: border-box;

  &__label {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--size-8);
    padding: var(--size-6) var(--size-16);
    line-height: var(--lineheight-sm);
    border-radius: var(--border-radius-2xl);
    flex: 1 0 auto;
    text-align: center;
    font-size: var(--font-sm);
    cursor: pointer;

    .a-icon {
      width: var(--size-24);
      height: var(--size-24);
    }

    &:has(:focus-visible) {
      outline: var(--focus-outline);
    }
  }

  &__label:has(input:checked) {
    color: var(--monochrome-900);
  }

  &--loading &__label:has(input:checked) {
    background: var(--secondary-400);
  }

  &__label-text {
    display: none;

    @include mq.tablet {
      display: block;
    }
  }

  &__highlight {
    position: absolute;
    top: 0;
    height: 100%;
    left: 0;
    width: 0;
    background: var(--secondary-400);
    border-radius: var(--border-radius-2xl);
    z-index: -1;
    transition-property: width, left;
    transition-duration: var(--animation-medium);
    transition-timing-function: var(--ease-out);
  }
}
</style>