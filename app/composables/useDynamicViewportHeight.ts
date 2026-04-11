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

    // visualViewport resize fires on both iOS Safari and Android Chrome
    // when the on-screen keyboard opens/closes — this is the most reliable approach
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewportSize)
      window.visualViewport.addEventListener('scroll', updateViewportSize)
    }

    // VirtualKeyboard API (Chrome 94+) as an additional listener for explicit keyboard events
    if ('virtualkeyboard' in navigator) {
      // @ts-ignore: is type unknown
      navigator.virtualkeyboard.addEventListener('geometrychange', updateViewportSize)
    }
  })

  onBeforeUnmount(() => {
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', updateViewportSize)
      window.visualViewport.removeEventListener('scroll', updateViewportSize)
    }

    if ('virtualkeyboard' in navigator) {
      // @ts-ignore: is type unknown
      navigator.virtualkeyboard.removeEventListener('geometrychange', updateViewportSize)
    }

    if (timeout) clearInterval(timeout)
  })

  return {
    height,
    isOpen
  }
}