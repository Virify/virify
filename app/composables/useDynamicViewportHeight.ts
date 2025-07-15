import type { ShallowRef } from "vue"

interface DynamicViewportHeight {
  height: ShallowRef<string>
  isOpen: ShallowRef<boolean>
}

export function useDynamicViewportHeight(): DynamicViewportHeight {
  let timeout: NodeJS.Timeout | null = null

  const height = shallowRef('100dvh')
  const isOpen = shallowRef(false)

  /**
   *  Update viewport height
   */
  function updateViewportSize() {
    if (!window.visualViewport) return

    // Save values
    height.value = window.visualViewport.height + 'px'
    isOpen.value = window.innerHeight !== window.visualViewport.height
  }

  onMounted(() => {
    updateViewportSize()

    if ('virtualkeyboard' in navigator) {
      /**
       *  @TODO
       *  The VirtualKeyboard API is not yet widely available and not
       *  currently recognised by TS
       */
      // @ts-ignore: is type unknown
      navigator.virtualkeyboard.addEventListener('geometrychange', updateViewportSize)
    }
    else {
      /**
       *  @TODO
       *  The VirtualKeyboard has patchy support, and JS does not provide
       *  any event for resizing when a virtual keyboard shows. Focus events
       *  can be used, but are unreliable. The simplest fix for the time
       *  being is just to constantly ping for resize changes and update
       *  accordingly. Absolutely horrible, but once the VirtualKeyboard API
       *  has wider support, this can be removed :)
       */
      timeout = setInterval(updateViewportSize, 500)
    }
  })

  onBeforeUnmount(() => {
    if ('virtualkeyboard' in navigator) {
      // @ts-ignore: is type unknown
      navigator.virtualkeyboard.removeEventListener('geometrychange', updateViewportSize)
    }
    else {
      /**
       *  @TODO
       *  Also to remove here
       */
      if (timeout) clearTimeout(timeout)
    }
  })

  return {
    height,
    isOpen
  }
}