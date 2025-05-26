import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
export default defineNuxtConfig({
  extends: [
    "./layers/ui",
    "./layers/email",
    "./layers/database",
    './layers/auth',
    './layers/communication',
    './layers/map'
  ],
  future: {
    compatibilityVersion: 4,
  },
  modules: ["@nuxt/image"],
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  nitro: {
    rollupConfig: {
      // @ts-ignore
      plugins: [vue()],
    },
  },
});
