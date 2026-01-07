export const useDashboardSearch = () => {
  const groups = useState<any[]>('dashboard-search-groups', () => [])

  const setGroups = (newGroups: any[]) => {
    groups.value = newGroups
  }
  return {
    groups,
    setGroups,
  }
}
