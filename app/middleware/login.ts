export default defineNuxtRouteMiddleware((to, from) => {
  // Get the user session
  const { loggedIn } = useUserSession();

  // Get runtime configuration
  const config = useRuntimeConfig();

  // Get the cookie to redirect the user back to the page they were trying to access
  const redirectCookieName = config.public.redirectCookieName || "redirect";
  const lastPage = useCookie(redirectCookieName);

  // Clear the last page cookie if coming from the signup page
  if (from.fullPath === "/signup") {
    lastPage.value = null;
  }

  // If logged in and navigating to the login page, allow access
  if (loggedIn.value && to.fullPath === "/login") {
    return;
  }

  // If logged in and not navigating to the account page, redirect to the account page
  if (loggedIn.value && to.fullPath !== "/account") {
    return navigateTo("/account");
  }
  
  // If not logged in and navigating to the login page, clear the last page cookie
  if (!loggedIn.value && to.fullPath === "/login") {
    lastPage.value = null;
    to.query.error = "Please log in to access this page.";
  }
});