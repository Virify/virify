export default defineNuxtRouteMiddleware((to) => {
  const { isWaitingListMode } = useWaitingListMode()

  // Only apply restrictions if deployment environment is 'waiting-list' (waiting list mode)
  if (!isWaitingListMode.value) {
    return
  }

  // Check if the current route is allowed
  const isAllowed = isRouteAllowed(to.path)

  // If route is not allowed, redirect to waiting list
  if (!isAllowed) {
    return navigateTo('/')
  }
})
