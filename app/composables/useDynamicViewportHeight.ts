import type { ShallowRef } from "vue"
import { createSharedComposable } from "@vueuse/core"

interface DynamicViewportHeight {
  height: ShallowRef<string>
  isOpen: ShallowRef<boolean>
}

// Make it a shared composable to only bind one global resize/scroll listener
export const useDynamicViewportHeight = createSharedComposable((): DynamicViewportHeight => {
  const height = shallowRef('100dvh')
  const isOpen = shallowRef(false)

  function updateViewportSize() {
    if (!window.visualViewport) return

    // iOS and Android Chrome both reliably update visualViewport height on keyboard open
    height.value = window.visualViewport.height + 'px'
    isOpen.value = window.innerHeight !== window.visualViewport.height

    // Set globally on root so any modal/dialog can use var(--rv-height, 100%)
    document.documentElement.style.setProperty('--rv-height', height.value)
    
    // Also export offset top strictly for iOS where keyboard can push visual viewport out of physical window bounds 
    const offset = window.visualViewport.offsetTop || 0
    document.documentElement.style.setProperty('--rv-offset', offset + 'px')
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
  })

  return {
    height,
    isOpen
  }
})