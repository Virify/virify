<template>
  <div ref="$wrapper" role="presentation" class="o-pane-slider">
    <div v-if="leftSlot" role="presentation" class="o-pane-slider__pane o-pane-slider__pane--left"
      :class="{ 'o-pane-slider__pane--full': !bothSlots }">
      <slot name="left"></slot>
    </div>

    <button v-show="bothSlots" ref="$thumb" type="button" class="o-pane-slider__slider" role="separator"
      aria-orientation="vertical">
      <div class="o-pane-slider__slider-thumb" role="hidden">
        <span class="o-pane-slider__slider-icon" role="hidden"></span>
      </div>
    </button>

    <div v-if="rightSlot" role="presentation" class="o-pane-slider__pane o-pane-slider__pane--right"
      :class="{ 'o-pane-slider__pane--full': !bothSlots }">
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

<style lang="scss">
.o-pane-slider {
  --pane-spacing: var(--size-16);
  --thumb-grab-width: var(--size-32);

  position: relative;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  gap: var(--pane-spacing);

  &__pane {
    flex: 1 0 auto;

    &--left {
      width: calc(v-bind(leftWidth) - var(--pane-spacing));
      flex: 0 0 auto;
    }

    &--full {
      width: 100%;
    }
  }


  &__slider {
    position: sticky;
    left: 0;
    top: 0;
    bottom: 0;
    width: 0;
    height: auto;
    min-height: 12ch;
    max-height: 100svh;
    margin: 0;
    padding: 0;
    border: 0;
    cursor: grab;
    user-select: none;
    touch-action: none;

    &:active {
      cursor: grabbing;
    }
  }

  &__slider-thumb {
    position: absolute;
    top: 0;
    left: calc(0px - var(--thumb-grab-width) / 2);
    height: 100%;
    width: var(--thumb-grab-width);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__slider-icon {
    display: block;
    width: var(--size-6);
    height: 5ch;
    background: light-dark(var(--monochrome-600), var(--monochrome-500));
    border-radius: var(--border-radius-pill);
    transition: width, height, background-color;
    transition-duration: var(--animation-fast);
  }

  &__slider:active &__slider-icon,
  &__slider:hover &__slider-icon {
    width: var(--size-8);
    height: 7ch;
    background: var(--secondary-400);
  }
}
</style>