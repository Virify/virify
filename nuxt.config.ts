import vue from "@vitejs/plugin-vue";
export default defineNuxtConfig({
  extends: ["./layers/ui", "./layers/email", "./layers/database", "./layers/auth", "./layers/map", "./layers/analytics", "./layers/websocket", "./layers/seed"],
  future: {
    compatibilityVersion: 4,
  },
  modules: ["@nuxt/image"],
  compatibilityDate: "2025-07-09",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1" }
      ]
    }
  },
  vite: {
    plugins: [],
  },
  nitro: {
    experimental: {
      tasks: true,
      asyncContext: true,
    },
    rollupConfig: {
      // @ts-ignore
      plugins: [vue()],
    },
  },
});
