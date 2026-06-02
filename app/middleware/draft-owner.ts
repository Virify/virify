export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn } = useUserSession();

  // Must be logged in to view draft previews (owner or shared user — enforced by the API)
  if (!loggedIn.value) {
    const redirectCookie = useCookie("redirect");
    redirectCookie.value = to.fullPath;
    return navigateTo("/?showLogin=true");
  }
});
