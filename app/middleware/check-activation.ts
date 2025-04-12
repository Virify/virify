export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = to.params.token;

  try {
    await $fetch("/auth/check-not-activated", {
      method: "GET",
      params: {
        token: token as string,
      },
    });
  } catch (err) {
    return navigateTo({
      path: "/login",
      query: { error: "Invalid or expired token" },
    });
  }
});