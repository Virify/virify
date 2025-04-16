export default defineNuxtConfig({
  modules: ['nuxt-auth-utils', '@nuxt/test-utils/module'],
  runtimeConfig: {
    public: {
      redirectCookieName: "redirect",
      loginUrl: "/login",
      NUXT_SESSION_PASSWORD: process.env.NUXT_SESSION_PASSWORD,
    }
  },
  imports: {
    dirs: [
      "server/**",
      "server/utils/**",
    ],
  },
});