<template>
  <div ref="$scrollbox" class="m-scrollbox | no-visible-scroll" :class="{
    'm-scrollbox--overflow': isOverflowing
  }">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'

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
}

/**
 *  Register events
 */
onMounted(() => {
  $scrollbox.value?.addEventListener('mousedown', mouseDown)
  window.addEventListener('mousemove', mouseMove)
  window.addEventListener('mouseup', mouseUp)

  useResizeObserver($scrollbox, setIsOverflowing)
})

onUnmounted(() => {
  $scrollbox.value?.removeEventListener('mousedown', mouseDown)
  window.removeEventListener('mousemove', mouseMove)
  window.removeEventListener('mouseup', mouseUp)
})
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
</style>