import { describe, it, expect } from 'vitest'

// ─── Tests ─────────────────────────────────────────────────────────────────

describe('ViewMode', () => {
  it('exports a ViewMode enum with grid, split, and map keys', async () => {
    const { ViewMode } = await import('../../../app/composables/useResultsViewMode')
    expect(Object.keys(ViewMode)).toContain('grid')
    expect(Object.keys(ViewMode)).toContain('split')
    expect(Object.keys(ViewMode)).toContain('map')
  })
})

describe('useResultsViewMode', () => {
  it('exports a useResultsViewMode function', async () => {
    const { useResultsViewMode } = await import('../../../app/composables/useResultsViewMode')
    expect(typeof useResultsViewMode).toBe('function')
  })

  it('returns currentView and setCurrentView', async () => {
    const { useResultsViewMode } = await import('../../../app/composables/useResultsViewMode')
    const result = useResultsViewMode()
    expect(result).toHaveProperty('currentView')
    expect(result).toHaveProperty('setCurrentView')
    expect(typeof result.setCurrentView).toBe('function')
  })

  describe('setCurrentView', () => {
    it('accepts valid view mode keys', async () => {
      const { useResultsViewMode, ViewMode } = await import('../../../app/composables/useResultsViewMode')
      const { setCurrentView, currentView } = useResultsViewMode()

      const validKeys = Object.keys(ViewMode) as Array<keyof typeof ViewMode>
      for (const key of validKeys) {
        setCurrentView(key)
        expect(currentView.value).toBe(key)
      }
    })

    it('falls back to grid for invalid view mode', async () => {
      const { useResultsViewMode } = await import('../../../app/composables/useResultsViewMode')
      const { setCurrentView, currentView } = useResultsViewMode()

      // Set to a valid mode first
      setCurrentView('split')
      expect(currentView.value).toBe('split')

      // Pass invalid value — should fall back to default (grid)
      setCurrentView('invalid' as 'grid')
      expect(currentView.value).toBe('grid')
    })

    it('sets view to grid', async () => {
      const { useResultsViewMode } = await import('../../../app/composables/useResultsViewMode')
      const { setCurrentView, currentView } = useResultsViewMode()
      setCurrentView('grid')
      expect(currentView.value).toBe('grid')
    })

    it('sets view to split', async () => {
      const { useResultsViewMode } = await import('../../../app/composables/useResultsViewMode')
      const { setCurrentView, currentView } = useResultsViewMode()
      setCurrentView('split')
      expect(currentView.value).toBe('split')
    })

    it('sets view to map', async () => {
      const { useResultsViewMode } = await import('../../../app/composables/useResultsViewMode')
      const { setCurrentView, currentView } = useResultsViewMode()
      setCurrentView('map')
      expect(currentView.value).toBe('map')
    })
  })
})
