export function useMainNavigation() {
  const { data: menuData } = useFetch('/api/navigation', { default: () => [] })

  return {
    mainMenu: computed(() => asArray(menuData.value))
  }
}