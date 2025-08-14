export default defineNuxtRouteMiddleware(async (to, from) => {
  const { loggedIn } = useUserSession()

  if (!loggedIn.value) {
    // Save the intended destination
    const redirectCookie = useCookie('redirect')
    redirectCookie.value = to.fullPath
    
    // Always redirect to home with showLogin flag (avoid infinite loops)
    return navigateTo('/?showLogin=true')
  }
})