type Popover = 'sort-order' | 'filter' | 'location'

// @TODO convert to ts enum
const VALID_NAMES = ['filters', 'location', 'sort-order']

/**
 *  @TODO - come up with a better solution
 */
export function useDockPopover() {
  const popoverName = useState<Popover | null>('dock-popover', () => null)

  function setPopoverName(newName: Popover | null) {
    if (newName && !VALID_NAMES.includes(newName)) return

    popoverName.value = newName || null
  }

  return {
    popoverName,
    setPopoverName
  }
}