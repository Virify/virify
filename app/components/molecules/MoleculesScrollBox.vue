<template>
  <div ref="$scrollbox" class="m-scrollbox | no-visible-scroll">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
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
 *  Register events
 */
onMounted(() => {
  $scrollbox.value?.addEventListener('mousedown', mouseDown)
  window.addEventListener('mousemove', mouseMove)
  window.addEventListener('mouseup', mouseUp)
})

onUnmounted(() => {
  $scrollbox.value?.removeEventListener('mousedown', mouseDown)
  window.removeEventListener('mousemove', mouseMove)
  window.removeEventListener('mouseup', mouseUp)
})
</script>

<style>
.m-scrollbox {
  display: flex;
  overflow: hidden;
  gap: var(--size-8);
  overflow: auto;
  scroll-behavior: smooth;
  user-select: none;
  cursor: grab;
}

.m-scrollbox:active {
  scroll-behavior: auto;
  cursor: grabbing;
}
</style>