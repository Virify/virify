export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = to.params.token
  try {
    await $fetch("/auth/check-password-token", {
      method: "GET",
      params: {
        token: token,
      },
    });
  } catch (err) {
    return navigateTo({
      path: "/login",
      query: { error: "Invalid or expired token" },
    });
  }
})