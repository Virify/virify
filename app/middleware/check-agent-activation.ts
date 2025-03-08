export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = to.params.token;
  const email = to.query.email;

  try {
    await $fetch("/auth/check-not-activated", {
      method: "GET",
      params: {
        email: email as string,
        token: token as string,
        role: "agent",
      },
    });
  } catch (err) {
    return navigateTo({
      path: "/agent/login",
      query: { error: "Invalid or expired token" },
    });
  }
});
