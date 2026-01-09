/**
 * Global state for dashboard search groups
 * Used to share search results/configuration across dashboard components
 */
export const useDashboardSearch = () => {
  /**
   * Search groups state
   */
  const groups = useState<any[]>('dashboard-search-groups', () => [])

  /**
   * Set the search groups
   * @param newGroups New groups array
   */
  const setGroups = (newGroups: any[]) => {
    groups.value = newGroups
  }
  return {
    groups,
    setGroups,
  }
}
