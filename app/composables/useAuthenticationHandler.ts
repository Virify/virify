import { ViewsDialogLogin } from '#components'

/**
 * Handle automatic login dialog from authentication middleware
 */
export function useAuthenticationHandler() {
  const route = useRoute()
  const { showDialog } = useDialog()

  onMounted(async () => {
    // Check if we should show the login dialog (from authentication middleware)
    if (route.query.showLogin === 'true') {
      const { loggedIn } = useUserSession()
      
      // Only show if user is still not logged in
      if (!loggedIn.value) {
        
        // Check if there's a redirect cookie to determine if user came from a protected page
        const redirectCookie = useCookie('redirect')
        const fromProtectedPage = !!redirectCookie.value
        
        showDialog({
          component: ViewsDialogLogin,
          props: {
            fromProtectedPage
          },
        })
      } else {
        // User is already logged in, just clean up the URL
        const cleanQuery = { ...route.query }
        delete cleanQuery.showLogin
        
        await navigateTo({
          path: route.path,
          query: cleanQuery
        }, { replace: true })
      }
    }
  })
}
