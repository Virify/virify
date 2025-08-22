type StyleAttribute = 'overflow' | 'paddingRight'
type Styles = Record<StyleAttribute, string>

interface UseScrollLock {
  lock: (shouldLock: boolean, container?: HTMLElement) => void
}

/**
 *  Allow scroll-locking
 *
 */
export function useScrollLock(): UseScrollLock {
  let originalStyles: Styles = { overflow: '', paddingRight: '' };

  /**
   *  Set styling to the HTML document
   */
  function setStyle(container: HTMLElement, styles: Styles) {
    const stylesArray = Object.entries(styles)

    for (const [attribute, value] of stylesArray) {
      container.style[attribute as StyleAttribute] = value
    }
  }

  /**
   *  Function to lock scrolling
   */
  function lock(shouldLock = false, container?: HTMLElement) {
    // Cannot get scrollbar width on server
    if (import.meta.server) return

    // Ensure container is a valid element, defaulting to document body
    if (!isElement(container)) {
      container = document.body
    }

    // Check if shouldLock is true/false
    if (shouldLock) {
      originalStyles = {
        overflow: container.style.overflow,
        paddingRight: container.style.paddingRight
      };

      const scrollbarWidth = window.innerWidth - container.offsetWidth

      setStyle(container, {
        overflow: 'hidden',
        paddingRight: `${scrollbarWidth}px`
      })
    }
    else {
      setStyle(container, originalStyles)
    }
  }

  return {
    lock
  }
}