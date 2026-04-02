export function useGlobalSearch() {
  const popoverId = 'global-search-modal'

  /**
   *  Get modal element by ID
   */
  function __getModalElement() {
    if (!import.meta.client) return

    return document.getElementById(popoverId)
  }

  /**
   *  Show modal
   */
  function showModal() {
    const popover = __getModalElement()

    popover?.showPopover()
  }

  /**
   *  Hide modal
   */
  function hideModal() {
    const popover = __getModalElement()

    popover?.hidePopover()
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