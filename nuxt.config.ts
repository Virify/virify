import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
export default defineNuxtConfig({
  extends: ["./layers/ui", "./layers/email", "./layers/database", "./layers/auth", "./layers/map", "./layers/analytics"],
  future: {
    compatibilityVersion: 4,
  },
  modules: ["@nuxt/image", "nuxt-gtag"],
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  nitro: {
    experimental: {
      openAPI: true,
      tasks: true,
    },
    rollupConfig: {
      // @ts-ignore
      plugins: [vue()],
    },
  },
  gtag: {
    id: process.env.G_TAG,
  },
});