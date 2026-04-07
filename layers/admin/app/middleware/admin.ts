export default defineNuxtRouteMiddleware(() => {
  const { loggedIn, user } = useUserSession();

  if (!loggedIn.value) {
    return navigateTo("/");
  }

  if (!isAdmin(user.value as Parameters<typeof isAdmin>[0])) {
    return navigateTo("/dashboard");
  }
});
