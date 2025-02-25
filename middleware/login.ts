export default defineNuxtRouteMiddleware((to, from) => {
  // get the user session
  const { loggedIn } = useUserSession();

  // Get runtime configuration
  const config = useRuntimeConfig();

  // get the cookie to redirect the user back to the page they were trying to access
  const redirectCookieName = config.public.redirectCookieName || "redirect";
  const lastPage = useCookie(redirectCookieName);

  if (from.fullPath === "/signup") {
    lastPage.value = null;
  }
  // if logged in
  if (loggedIn.value) {
    // if no cookie - redirect them to account
    if (!lastPage.value) {
      return navigateTo("/account");
    }
    // if cookie - and the cookie is the login page - redirect them to account
    if (lastPage.value === "/login") {
      return navigateTo("/account");
    }

    // if cookie - and not login page - redirect them to the last page
    return navigateTo(lastPage.value);
  }
});
