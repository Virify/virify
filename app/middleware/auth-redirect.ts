export default defineNuxtRouteMiddleware((to, from) => {
  // Get user session
  const { loggedIn } = useUserSession();

  // Get runtime configuration
  const config = useRuntimeConfig();

  // Define the redirect cookie name and login URL
  const redirectCookieName = config.public.redirectCookieName || "redirect";
  const loginUrl = config.public.loginUrl || "/login";

  // If not logged in
  if (!loggedIn.value) {
    // Save the page they were trying to access in a cookie
    const redirectCookie = useCookie(redirectCookieName);
    redirectCookie.value = from.fullPath;

    // Navigate to the login page
    return navigateTo(loginUrl);
  } else {
    // If logged in, clear the redirect cookie
    const redirectCookie = useCookie(redirectCookieName);
    redirectCookie.value = null;
  }
});
