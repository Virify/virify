type MaybeElement = MaybeRef<HTMLElement | null>

export function useVerticalDrag(maybeEl: MaybeElement) {
  // Track existing dragging
  const isDragging = shallowRef(false)
  const startY = shallowRef(0)
  const clientY = shallowRef(0)
  const dragDistance = shallowRef(0)

  /**
   *  Utils
   */
  function getClientY(e: TouchEvent | MouseEvent): number {
    if (!(e as TouchEvent)?.touches) return (e as MouseEvent).clientY

    return (e as TouchEvent)?.touches?.[0]?.clientY as number || 0
  }

  // Get element as raw value
  function getElement(el: MaybeElement) {
    el = unref(el)

    return isElement(el) ? el : null
  }

  /**
   *  Interaction methods
   */
  function dragStart(e: TouchEvent | MouseEvent) {
    isDragging.value = true

    const newClientY = getClientY(e)

    startY.value = newClientY;
    clientY.value = newClientY;
    dragDistance.value = 0
  }

  function dragMove(e: TouchEvent | MouseEvent) {
    if (!isDragging.value) return

    const newClientY = getClientY(e)

    clientY.value = newClientY;
    dragDistance.value = startY.value - newClientY;
  }

  function dragStop() {
    isDragging.value = false
  }

  // Mounted events
  onMounted(() => {
    const el = getElement(maybeEl)

    if (!el) return

    el.addEventListener('touchstart', dragStart)
    el.addEventListener('mousedown', dragStart)
    window.addEventListener('touchmove', dragMove)
    window.addEventListener('mousemove', dragMove)
    window.addEventListener('touchend', dragStop)
    window.addEventListener('mouseup', dragStop)
  })

  onBeforeUnmount(() => {
    const el = getElement(maybeEl)

    if (!el) return

    el.removeEventListener('touchstart', dragStart)
    el.removeEventListener('mousedown', dragStart)
    window.removeEventListener('touchmove', dragMove)
    window.removeEventListener('mousemove', dragMove)
    window.removeEventListener('touchend', dragStop)
    window.removeEventListener('mouseup', dragStop)
  })

  return {
    isDragging,
    startY,
    clientY,
    dragDistance
  }
}