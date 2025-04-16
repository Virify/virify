export default defineNuxtConfig({
  modules: ["nuxt-auth-utils"],
  runtimeConfig: {
    public: {
      redirectCookieName: "redirect",
      loginUrl: "/login",
      NUXT_SESSION_PASSWORD: process.env.NUXT_SESSION_PASSWORD,
    }
  },
});