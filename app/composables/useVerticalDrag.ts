type MaybeElement = MaybeRef<HTMLElement | null>

interface DragStart {
  clientY: number
}

interface DragMove {
  clientY: number
  relativeY: number
}

interface DragEnd {
  clientY: number
  relativeY: number
}

interface DragMethods {
  onDragMounted?: () => void
  onDragStart?: (e: DragStart) => void
  onDrag?: (e: DragMove) => void
  onDragEnd?: (e: DragEnd) => void
}

export function useVerticalDrag(maybeEl: MaybeElement, methods: DragMethods) {
  let isDragging = false
  let startClientY = 0
  let clientY = 0
  let relativeY = 0

  /**
   *  Userland methods
   */
  const { onDragMounted, onDragStart, onDrag, onDragEnd } = asObject(methods)

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
    isDragging = true
    startClientY = getClientY(e)

    if (isFunction(onDragStart)) {
      onDragStart({ clientY: startClientY })
    }
  }

  function dragMove(e: TouchEvent | MouseEvent) {
    if (!isDragging) return

    clientY = getClientY(e)
    relativeY = startClientY - clientY

    if (isFunction(onDrag)) {
      onDrag({ clientY, relativeY })
    }
  }

  function dragStop() {
    if (!isDragging) return

    isDragging = false

    if (isFunction(onDragEnd)) {
      onDragEnd({ clientY, relativeY })
    }
  }

  // Mounted events
  onMounted(() => {
    const el = getElement(maybeEl)

    if (!el) return

    if (isFunction(onDragMounted)) {
      onDragMounted()
    }

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
}