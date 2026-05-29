export enum ViewMode {
  'grid',
  'split',
  'map',
}

export type ViewModeKey = keyof typeof ViewMode

/**
 *  Set, get view mode for results page
 *
 */
export function useResultsViewMode() {
  const defaultView: ViewModeKey = 'grid'

  /**
   *  Global state for view mode
   */
  const currentView = useState<ViewModeKey>('results-view-mode', () => {
    return defaultView
  })

  /**
   *  Update view, with validation
   */
  function setCurrentView(newView: ViewModeKey) {
    if (!Object.keys(ViewMode).includes(newView)) {
      currentView.value = defaultView
      return
    }

    currentView.value = newView
  }

  /**
   *  Expose interface
   */
  return {
    currentView,
    setCurrentView
  }
}