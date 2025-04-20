import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
export default defineNuxtConfig({
  extends: [
    "./layers/ui",
    "./layers/email",
    "./layers/database",
    './layers/auth'
  ],
  future: {
    compatibilityVersion: 4,
  },
  modules: ["@nuxt/ui", "@nuxtjs/leaflet", "@nuxt/test-utils/module"],
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css", "leaflet/dist/leaflet.css"],
  ui: {
    theme: {
      colors: ["primary", "secondary", "accent", "info", "success", "warning", "error", "bg"],
    },
  },
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
    }
  },
  runtimeConfig: {
    public: {
      NOMINATIM_API_URL: process.env.NOMINATIM_API_URL,
    },
  },
});