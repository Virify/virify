export default defineNuxtRouteMiddleware((to, from) => {
  // we want to disable this in dev mode
  if (useRequestURL().hostname === "localhost") {
    return;
  } else {
    return navigateTo("/");
  }
});
