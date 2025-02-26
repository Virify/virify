export default defineNuxtRouteMiddleware((to, from) => {
  // Get user session
  const { loggedIn } = useUserSession();

  // Get runtime configuration
  const config = useRuntimeConfig();

  // Define the redirect cookie name and login URL
  const redirectCookieName = config.public.redirectCookieName || "redirect";
  const loginUrl = config.public.loginUrl || "/login";
  const agentloginUrl = "/agent/login";

  // If not logged in
  if (!loggedIn.value) {
    // Save the page they were trying to access in a cookie
    const redirectCookie = useCookie(redirectCookieName);
    redirectCookie.value = from.fullPath;

    // If the user is an agent, navigate to the agent login page
    if (to.path.startsWith("/agent")) {
      return navigateTo(agentloginUrl);
    } else {
      // Navigate to the login page
      return navigateTo(loginUrl);
    }
  } else {
    // If logged in, clear the redirect cookie
    const redirectCookie = useCookie(redirectCookieName);
    redirectCookie.value = null;
  }
});
