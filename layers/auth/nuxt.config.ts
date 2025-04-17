export default defineNuxtConfig({
  modules: ['nuxt-auth-utils'],
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
      "server/routes/**",
      "server/routes/auth/**",
      "server/utils/**",
    ],
  },
});