<template>
  <div ref="$wrapper" role="presentation" class="window">
    <div v-if="leftSlot" role="presentation" class="pane pane-left" :class="{ 'pane-full': !bothSlots }">
      <slot name="left"></slot>
    </div>

    <button v-show="bothSlots" ref="$thumb" type="button" class="slider" role="separator" aria-orientation="vertical">
      <div class="slider-thumb" role="hidden"></div>
    </button>

    <div v-if="rightSlot" role="presentation" class="pane pane-right" :class="{ 'pane-full': !bothSlots }">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  leftSlot: boolean
  rightSlot: boolean
}

const props = defineProps<Props>()

const bothSlots = computed(() => {
  const { leftSlot, rightSlot } = asObject(props)

  return !!leftSlot && !!rightSlot
})

/**
 *  Defaults
 */
const PANE_MIN_WIDTH = 400
const PANE_CLOSE_BOUNDARY = 300

/**
 *  Monitor for bounds dragging
 */
const emit = defineEmits(['boundary-exceeded'])

/**
 *  Components
 */
const $wrapper = useTemplateRef('$wrapper')
const $thumb = useTemplateRef('$thumb')

/**
 *  Monitor wrapper width, drag handle bounds
 */
const wrapperWidth = ref(0)
const currentPosition = ref(0)

function setWrapperWidth(setInitialWidth = false) {
  wrapperWidth.value = $wrapper.value?.getBoundingClientRect().width || 0

  const currentX = currentPosition.value
  const midX = wrapperWidth.value / 2

  currentPosition.value = setWithinBounds(setInitialWidth ? midX : currentX)
}

function checkDragToClose(dragPosition: number) {
  const minLeft = PANE_CLOSE_BOUNDARY
  const maxRight = wrapperWidth.value - PANE_CLOSE_BOUNDARY

  isDragToClose.value = false

  if (dragPosition < minLeft) {
    isDragToClose.value = 'left'
  }

  if (dragPosition > maxRight) {
    isDragToClose.value = 'right'
  }
}

function setWithinBounds(newPosition: number) {
  const minLeft = PANE_MIN_WIDTH
  const maxRight = wrapperWidth.value - PANE_MIN_WIDTH

  // Monitor drag-to-close
  checkDragToClose(newPosition)

  // Set bounds
  return Math.max(Math.min(newPosition, maxRight), minLeft)
}

/**
 *  Track pane sizes
 */
let resizer: ResizeObserver

onMounted(() => {
  if (!$wrapper.value) return

  resizer = new ResizeObserver(() => setWrapperWidth())
  resizer.observe($wrapper.value)

  nextTick(() => setWrapperWidth(true))
})

onBeforeUnmount(() => {
  if (resizer) resizer.disconnect()
})

/**
 *  Functions to resize panes
 */
const isDragging = ref(false)
const isDragToClose = ref<'left' | 'right' | false>(false)

function getEventPosition(event: Event): number {
  const isTouch = !!(event as TouchEvent).touches

  if (isTouch) {
    return (event as TouchEvent).touches[0]?.clientX || 0
  }

  return (event as MouseEvent).clientX
}

function dragStart() {
  isDragging.value = true
}

function drag(event: Event) {
  if (!isDragging.value || !$wrapper.value) return

  // Get dynamic positions
  const positionDragged = getEventPosition(event)
  const { left } = $wrapper.value.getBoundingClientRect()

  // Save within bounds
  currentPosition.value = setWithinBounds(positionDragged - left)
}

function dragEnd() {
  if (!isDragging.value) return

  isDragging.value = false

  if (isDragToClose.value) {
    emit('boundary-exceeded', isDragToClose.value)
  }
}

/**
 *  Register and unregisterevents
 */
const startEvents = ['mousedown', 'touchstart']
const moveEvents = ['mousemove', 'touchmove']
const endEvents = ['mouseup', 'touchend']

onMounted(() => {
  startEvents.forEach((event) => {
    $thumb.value?.addEventListener(event, dragStart, { passive: true })
  })

  moveEvents.forEach((event) => {
    window.addEventListener(event, drag, { passive: true })
  })

  endEvents.forEach((event) => {
    window.addEventListener(event, dragEnd, { passive: true })
  })
})

onBeforeUnmount(() => {
  startEvents.forEach((event) => {
    $thumb.value?.removeEventListener(event, dragStart)
  })

  moveEvents.forEach((event) => {
    window.removeEventListener(event, drag)
  })

  endEvents.forEach((event) => {
    window.removeEventListener(event, dragEnd)
  })
})

/**
 *  Computed for CSS variables
 */
const positionPercent = computed(() => {
  return 100 * (currentPosition.value / wrapperWidth.value)
})

const leftWidth = computed(() => unref(positionPercent) + '%')
</script>

<style scoped>
.window {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: stretch;
  gap: var(--size-16);
}

.pane {
  padding: var(--size-32);
  box-sizing: border-box;
  border-radius: var(--border-radius-2xl);
}

.pane-left {
  width: calc(v-bind(leftWidth) - var(--size-16));
  background: #fff;
  flex: 0 0 auto;
}

.pane-right {
  flex: 1 0;
  background: #ccc;
}

.pane-full {
  width: 100%;
}

.slider {
  position: sticky;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0;
  height: 100dvh;
  margin: 0;
  padding: 0;
  border: 0;
  cursor: grab;
  user-select: none;
  touch-action: none;
}

.slider:active {
  cursor: grabbing;
}

.slider-thumb {
  position: absolute;
  top: 0;
  bottom: 0;
  width: var(--size-2);
  transform: translateX(-50%);
  background: var(--secondary-400);
}

.slider:active .slider-thumb,
.slider:hover .slider-thumb {
  width: var(--size-16);
}
</style>