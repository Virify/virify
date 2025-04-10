export default defineNuxtRouteMiddleware((to, from) => {
  // Get user session
  const { loggedIn } = useUserSession();

  // Get runtime configuration
  const config = useRuntimeConfig();

  // Define the redirect cookie name and login URL
  const redirectCookieName = config.public.redirectCookieName || "redirect";
  const loginUrl = config.public.loginUrl || "/login";
  const agentloginUrl = "/agent/login";

  // If not logged in and not navigating to the signup page
  if (!loggedIn.value && to.fullPath !== "/signup") {
    // Save the page they were trying to access in a cookie
    const redirectCookie = useCookie(redirectCookieName);
    redirectCookie.value = to.fullPath;

    // If the user is an agent, navigate to the agent login page
    if (to.path.startsWith("/agent")) {
      return navigateTo({
        path: agentloginUrl,
        query: { error: "auth" },
      });
    } else {
      // Navigate to the login page
      return navigateTo({
        path: loginUrl,
        query: { error: "auth" },
      });
    }
  } else {
    // If logged in, clear the redirect cookie
    const redirectCookie = useCookie(redirectCookieName);
    redirectCookie.value = null;
  }
});