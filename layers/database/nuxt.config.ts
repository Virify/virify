export default defineNuxtConfig({
  runtimeConfig: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  imports: {
    dirs: [
      "server/**",
      "server/utils/**",
    ],
  }
});