export async function useMainNavigation() {
  const { data: mainMenu } = await useFetch('/api/navigation')

  return {
    mainMenu
  }
}