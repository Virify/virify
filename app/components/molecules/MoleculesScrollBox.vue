<template>
  <div role="presentation" class="m-scrollbox-indicator" :class="{
    'm-scrollbox-indicator--left': isOverflowing && indicatorPosition !== 'right',
    'm-scrollbox-indicator--right': isOverflowing && indicatorPosition !== 'left'
  }">
    <div ref="$scrollbox" class="m-scrollbox | no-visible-scroll" :class="{
      'm-scrollbox--overflow': isOverflowing
    }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'

/**
 *  Show gradient indicator for scrollbox
 */
interface Props {
  scrollIndicator?: boolean
}

withDefaults(defineProps<Props>(), {
  scrollIndicator: false
})

/**
 *  Wrappers
 */
const $scrollbox = useTemplateRef('$scrollbox')

/**
 *  Track scrolling state
 */
let isDragging = false
let prevousClientX = 0
let previousScroll = 0

/**
 *  Event functions
 */
function mouseDown(event: MouseEvent | TouchEvent) {
  if (event instanceof TouchEvent) return

  isDragging = true
  prevousClientX = event.clientX
  previousScroll = $scrollbox.value?.scrollLeft || 0
}

function mouseMove(event: MouseEvent) {
  if (!isDragging) return

  const scrollDistance = prevousClientX + previousScroll - event.clientX

  $scrollbox.value?.scrollTo(scrollDistance, 0)
}

function mouseUp() {
  isDragging = false
}

/**
 *  Set class to indicate element can overflow
 */
const isOverflowing = ref(false)

function setIsOverflowing(resizeEvents: readonly ResizeObserverEntry[]) {
  const { target } = asObject(resizeEvents?.[0])

  // Ensure target is an element
  if (!isElement(target)) return

  // Set size if scrollbox can overflow
  isOverflowing.value = target.scrollWidth > target.clientWidth

  // Update scroll indicators
  toggleScrollIndicator(target)
}

/**
 *  Register events
 */
onMounted(() => {
  const root = $scrollbox.value

  root?.addEventListener('scroll', addScrollIndicatorEvent)
  root?.addEventListener('mousedown', mouseDown)
  window.addEventListener('mousemove', mouseMove)
  window.addEventListener('mouseup', mouseUp)

  useResizeObserver($scrollbox, setIsOverflowing)
})

onUnmounted(() => {
  const root = $scrollbox.value

  root?.removeEventListener('scroll', addScrollIndicatorEvent)
  root?.removeEventListener('mousedown', mouseDown)
  window.removeEventListener('mousemove', mouseMove)
  window.removeEventListener('mouseup', mouseUp)
})

/**
 *  Monitor if scrolled to start/end
 */
const indicatorPosition = shallowRef<'left' | 'right' | 'both'>('both')

function addScrollIndicatorEvent({ target }: Event) {
  toggleScrollIndicator(target as HTMLElement)
}

function toggleScrollIndicator(scrollBox: HTMLElement) {
  if (!isElement(scrollBox)) return

  // Get min/max scroll - offset by up to 1 to account for sub-pixels
  const scrollLeft = scrollBox.scrollLeft
  const MIN_SCROLL = 0
  const MAX_SCROLL = Math.floor(scrollBox.scrollWidth - scrollBox.offsetWidth)

  // Check scroll distances
  if (scrollLeft <= MIN_SCROLL + 1) {
    indicatorPosition.value = 'right'

    return
  }
  if (scrollLeft >= MAX_SCROLL - 1) {
    indicatorPosition.value = 'left'

    return
  }
  indicatorPosition.value = 'both'
}
</script>

<style lang="scss">
.m-scrollbox {
  overflow: auto;
  scroll-behavior: smooth;

  &--overflow {
    user-select: none;
    cursor: grab;

    &:active {
      scroll-behavior: auto;
      cursor: grabbing;
    }
  }
}

.m-scrollbox-indicator {
  --overflow-indicator-size: var(--size-56);
  --overflow-indicator-color: var(--background-200);

  position: relative;
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    height: 100%;
    width: var(--overflow-indicator-size);
    pointer-events: none;
    transition: transform var(--animation-subtle) var(--ease-out);
  }

  &::before {
    left: 0;
    transform: translateX(calc(0px - var(--overflow-indicator-size)));
    background: linear-gradient(to right, var(--overflow-indicator-color), transparent);
  }

  &::after {
    right: 0;
    transform: translateX(var(--overflow-indicator-size));
    background: linear-gradient(to left, var(--overflow-indicator-color), transparent);
  }

  &--left::before {
    transform: none;
  }

  &--right::after {
    transform: none;
  }
}
</style>