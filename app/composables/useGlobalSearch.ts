export function useGlobalSearch() {
  const popoverId = 'global-search-modal'

  /**
   *  Get modal element by ID
   */
  function __getModalElement(): HTMLElement {
    const elem = document.getElementById(popoverId)

    if (!elem) {
      throw new Error('No popover exists')
    }

    return elem
  }

  /**
   *  Show modal
   *
   *  @TODO - casting initEl to make it more convenient to put inline
   *          is a bit lazy. Maybe have separate functions for it initEl
   *          exists?
   */
  function showModal(initEl?: HTMLElement | null | Event) {
    if (!import.meta.client) return

    const popoverEl = __getModalElement()

    popoverEl?.showPopover()

    // If no init element, animate as normal
    if (!isElement(initEl)) {
      return
    }

    // Get the first form element within the popover - this should be the
    // location search form
    const popverContentEl = popoverEl.querySelector('.search-modal__content')

    // If no form, do nothing
    if (!isElement(popverContentEl)) {
      return
    }

    // Get bounds for each element
    const startBounds = initEl.getBoundingClientRect()
    const endBounds = popverContentEl.getBoundingClientRect()

    // Calculate differences to animate between
    const offsetY = endBounds.top - startBounds.top
    const startWidth = startBounds.width + 'px'
    const endWidth = endBounds.width + 'px'

    // Clear any existing animations
    popverContentEl.getAnimations().forEach((animation) => {
      animation.cancel()
    })

    // Animate to new position
    popverContentEl.animate([
      {
        transform: `translateY(${0 - offsetY}px)`,
        width: startWidth
      },
      {
        transform: 'none',
        width: endWidth
      },
    ], {
      duration: 200,
      delay: 150,
      fill: 'backwards',
      easing: 'cubic-bezier(0, 0.7, 0.5, 1)'
    })
  }

  /**
   *  Hide modal
   */
  function hideModal() {
    if (!import.meta.client) return

    const popoverEl = __getModalElement()

    popoverEl?.hidePopover()
    popoverEl?.style.removeProperty('--starting-style-offset-y')
  }

  /**
   *  Expose interface
   */
  return {
    popoverId,
    showModal,
    hideModal
  }
}