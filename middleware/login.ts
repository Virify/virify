export default defineNuxtRouteMiddleware((to, from) => {
  // get the user session
  const {loggedIn} = useUserSession();

  // Get runtime configuration
  const config = useRuntimeConfig();

  // get the cookie to redirect the user back to the page they were trying to access
  const redirectCookieName = config.public.redirectCookieName || "redirect";
  const lastPage = useCookie(redirectCookieName);

  // if logged in
  if(loggedIn.value) {
    // if no cookie - redirect them to account
    if(!lastPage.value) {
      return navigateTo('/account');
    }
    // if cookie - navigate to the last page
    return navigateTo(lastPage.value);
  }
});